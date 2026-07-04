"""Canlı işlem — GERÇEK bir borsada GERÇEK para. İşlevsel, ancak güvenlik kapılarıyla korunur.

Aşağıdaki emir döngüsü tamamen bağlıdır: en son KAPANMIŞ barı çeker, backtest'in
kullandığı aynı riske göre boyutlandırılmış hedef ağırlığı hesaplar, bunu gerçek
borsa bakiyenizle mutabık kılar ve ccxt üzerinden piyasa emirleri gönderir.

Şu kapıların TÜMÜNÜ geçmediğiniz sürece bunların hiçbirini yapmaz:
  1. execution.mode == "live"
  2. execution.live.enabled == true
  3. onay ifadesini yazarsınız
  4. API kimlik bilgileri ortam değişkenlerinde (asla diskte değil)
ve varsayılan olarak borsa SANDBOX'ını ve DRY-RUN'ı (göndereceği emirleri *göndermeden*
kaydeder) kullanır. Gerçek emirler göndermek için execution.live.dry_run değerini false
yapın — kasıtlı, tek satırlık bir seçim. Emir başına bir nominal üst sınır ve bir Ctrl-C
kill switch her zaman etkindir.

Bunun gönderdiği her emirden yalnızca siz sorumlusunuz. Önce haftalarca sandbox/paper
ortamında test edin. Bu bir yatırım tavsiyesi değildir.
"""

from __future__ import annotations

import logging
import time

from tradingbot.config import Config

log = logging.getLogger(__name__)

CONFIRM_PHRASE = "I ACCEPT THE RISK"


class LiveTradingBlocked(RuntimeError):
    """Bir canlı işlem güvenlik kapısı karşılanmadığında yükseltilir."""


def preflight(cfg: Config) -> None:
    """Her güvenlik kapısını doğrula. İlk başarısızlıkta LiveTradingBlocked yükseltir."""
    live = cfg.execution.live
    if cfg.execution.mode != "live":
        raise LiveTradingBlocked("execution.mode 'live' değil — işlem yapmayı reddediyor.")
    if not live.enabled:
        raise LiveTradingBlocked(
            "execution.live.enabled false — gerçek emir vermeyi reddediyor."
        )
    key, secret = live.credentials()
    if not key or not secret:
        raise LiveTradingBlocked(
            f"API kimlik bilgileri eksik. {live.api_key_env} ve "
            f"{live.api_secret_env} değerlerini ortamınızda ayarlayın (asla bir dosyada değil)."
        )
    try:
        import ccxt  # noqa: F401
    except ImportError as exc:
        raise LiveTradingBlocked("ccxt yüklü değil; canlı işlem yapılamaz.") from exc


def _confirm_interactively(cfg: Config) -> None:
    if not cfg.execution.live.require_confirmation:
        return
    live = cfg.execution.live
    print("\n" + "=" * 70)
    print("  CANLI İŞLEM — bu, GERÇEK parayla GERÇEK emirler verebilir.")
    print("  Sermayenizin bir kısmını veya tamamını kaybedebilirsiniz. Bu bir tavsiye değildir.")
    print(f"  Borsa: {cfg.market.exchange}   Sembol: {cfg.market.symbol}")
    print(f"  Sandbox : {live.use_sandbox}    Dry-run: {live.dry_run}    "
          f"Maks emir: {live.max_order_notional} {cfg.market.symbol.split('/')[-1]}")
    print("=" * 70)
    typed = input(f'Devam etmek için tam olarak "{CONFIRM_PHRASE}" yazın (başka herhangi bir şey iptal eder): ')
    if typed.strip() != CONFIRM_PHRASE:
        raise LiveTradingBlocked("Onay ifadesi eşleşmedi — iptal ediliyor.")


def _build_client(cfg: Config):
    import ccxt

    key, secret = cfg.execution.live.credentials()
    client = getattr(ccxt, cfg.market.exchange)(
        {"apiKey": key, "secret": secret, "enableRateLimit": True}
    )
    if cfg.execution.live.use_sandbox and getattr(client, "has", {}).get("sandbox"):
        client.set_sandbox_mode(True)
        log.info("%s için Sandbox modu ETKİNLEŞTİRİLDİ", cfg.market.exchange)
    return client


def _latest_target(cfg: Config):
    """Mevcut geçmiş üzerinde eğit ve son bar için (target_weight, price) döndür."""
    from tradingbot.data.loader import get_ohlcv
    from tradingbot.features.pipeline import build_dataset
    from tradingbot.models.registry import build_model
    from tradingbot.risk.sizing import target_weights

    df = get_ohlcv(cfg)
    ds = build_dataset(df, cfg)
    is_classifier = ds.label_kind == "direction"
    model = build_model(cfg)
    model.fit(ds.X, ds.y)
    signal = model.predict_signal(ds.X)
    tw = target_weights(ds.frame, signal, cfg, is_classifier)
    return float(tw.iloc[-1]), float(ds.frame["close"].iloc[-1])


def _reconcile_and_order(cfg: Config, client, target_weight: float, price: float) -> None:
    """Borsa pozisyonunu üst sınırlı bir piyasa emriyle target_weight'e doğru taşı."""
    live = cfg.execution.live
    base, quote = cfg.market.symbol.split("/")
    balances = client.fetch_balance()
    base_units = float(balances.get(base, {}).get("free", 0.0) or 0.0)
    quote_free = float(balances.get(quote, {}).get("free", 0.0) or 0.0)

    equity = quote_free + base_units * price
    target_units = (target_weight * equity) / price if price > 0 else 0.0
    delta = target_units - base_units
    notional = abs(delta) * price

    if notional < max(10.0, getattr(client, "markets", {}).get(cfg.market.symbol, {}).get("limits", {}).get("cost", {}).get("min", 0) or 0):
        log.info("Hedefe ulaşıldı (Δnominal %.2f %s minimumun altında) — emir yok.", notional, quote)
        return

    # Tek bir emir için katı güvenlik üst sınırı.
    if notional > live.max_order_notional:
        delta = (live.max_order_notional / price) * (1 if delta > 0 else -1)
        notional = live.max_order_notional
        log.warning("Emir max_order_notional=%.2f %s değerine sınırlandı", live.max_order_notional, quote)

    side = "buy" if delta > 0 else "sell"
    amount = abs(delta)
    if live.dry_run:
        log.warning("[DRY-RUN] %s %.8f %s (~%.2f %s) @ ~%.2f yapardı",
                    side, amount, base, notional, quote, price)
        return

    order = client.create_order(cfg.market.symbol, "market", side, amount)
    log.warning("CANLI EMİR GÖNDERİLDİ: %s %.8f %s -> id=%s", side, amount, base, order.get("id"))


def run_live_session(cfg: Config, steps: int = 1) -> None:
    """Korumalı canlı işlem döngüsü. Her kapıyı geçer, ardından kapanmış barlarda işlem yapar."""
    preflight(cfg)
    _confirm_interactively(cfg)
    client = _build_client(cfg)
    live = cfg.execution.live

    log.warning(
        "Canlı oturum başlıyor (dry_run=%s, sandbox=%s). Durdurmak için Ctrl-C (kill switch).",
        live.dry_run, live.use_sandbox,
    )
    try:
        for step in range(max(1, steps)):
            try:
                target_weight, price = _latest_target(cfg)
                log.info("Adım %d/%d: target_weight=%.4f price=%.2f",
                         step + 1, steps, target_weight, price)
                _reconcile_and_order(cfg, client, target_weight, price)
            except Exception as exc:  # kötü bir yoklama döngüyü sessizce öldürmesin
                log.error("Canlı adım başarısız oldu: %s", exc)
            if step < steps - 1:
                time.sleep(max(1, cfg.execution.poll_seconds))
    except KeyboardInterrupt:
        log.warning("Kill switch: kullanıcı tarafından kesildi. Yeni emir gönderilmeyecek.")
    log.warning("Canlı oturum sona erdi.")
