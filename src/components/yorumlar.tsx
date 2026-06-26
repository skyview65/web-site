import { T } from "@/components/i18n";

const REVIEWS = [
  {
    stars: "★★★★★",
    qId: "rev_q1",
    qTr: "92 basamağı okuyunca gözüm korkmuştu. Üçüncü gün fark ettim: gün içinde en çok o inişi sever olmuşum. Her basamakta deniz biraz daha yaklaşıyor.",
    kId: "rev_k1",
    kTr: "<b>SELİN K.</b> · MEHTAP SÜİTİ · EYLÜL 2025",
  },
  {
    stars: "★★★★★",
    qId: "rev_q2",
    qTr: "Odada televizyon yok, resepsiyonda acele yok, menüde seçenek yok. Kulağa eksik geliyor, değil mi? Gidin. Eksik olan şeylerin hepsinin fazlalık olduğunu anlıyorsunuz.",
    kId: "rev_k2",
    kTr: "<b>EMRE D.</b> · GURUP SÜİTİ · TEMMUZ 2025",
  },
  {
    stars: "★★★★★",
    qId: "rev_q3",
    qTr: "Eşimle yirminci yılımız için gittik. Akşam yemeğinde tebeşirle yazılmış menüyü görünce gülümsedik; kalkarken ev sahibine “yarın ne yazacak?” diye sordum. “Deniz bilir,” dedi.",
    kId: "rev_k3",
    kTr: "<b>AYŞE &amp; MURAT T.</b> · YILDIZ SÜİTİ · HAZİRAN 2025",
  },
  {
    stars: "★★★★☆",
    qId: "rev_q4",
    qTr: "Mükemmeliyetçilere not: buraya plan yapmaya değil, planı bırakmaya geliyorsunuz. Tek eleştirim ayrılık sabahı: 92 basamağı bu kez yukarı çıkmak zor geldi.",
    kId: "rev_k4",
    kTr: "<b>DENİZ A.</b> · İKİNDİ SÜİTİ · EKİM 2025",
  },
];

/** "Misafir Defteri" — the guestbook. Those who return tell it best. */
export function Yorumlar() {
  return (
    <section id="yorumlar">
      <div className="yorum-baslik">
        <T
          id="rev_tag"
          tr="MİSAFİR DEFTERİ"
          className="etiket rv"
          style={{ marginBottom: 18 }}
        />
        <T
          id="rev_h2"
          tr="Bizi en iyi, <em>dönenler</em> anlatır."
          as="h2"
          className="buyuk rv"
          style={{ margin: "0 auto" }}
        />
        <T
          id="rev_puan"
          tr="<b>4,9 / 5</b> · 100+ DEĞERLENDİRME · SON İKİ SEZON"
          className="puan rv"
        />
      </div>

      <div className="yorumlar">
        {REVIEWS.map((r) => (
          <div className="yorum rv" key={r.kId}>
            <span className="yildizlar" aria-hidden="true">
              {r.stars}
            </span>
            <T id={r.qId} tr={r.qTr} as="q" />
            <T id={r.kId} tr={r.kTr} className="kim" />
          </div>
        ))}
      </div>
    </section>
  );
}
