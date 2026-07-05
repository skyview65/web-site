/**
 * Ad provider abstraction — the monetization seam.
 *
 * At portal launch, swap `SimulatedAdProvider` for a real adapter:
 *
 *   Poki:        rewarded  → PokiSDK.rewardedBreak()
 *                interstitial → PokiSDK.commercialBreak()
 *   CrazyGames:  rewarded  → CrazyGames.SDK.ad.requestAd("rewarded", cb)
 *                interstitial → CrazyGames.SDK.ad.requestAd("midgame", cb)
 *
 * Nothing else in the game knows which provider is behind this interface.
 */

export type AdKind = "rewarded" | "interstitial";

export interface AdProvider {
  /**
   * Shows an ad of the given kind. Resolves `true` if the reward should be
   * granted (always true for interstitials that completed).
   * `onTick` reports remaining seconds so the UI can render a countdown.
   */
  show(kind: AdKind, onTick?: (remainingSec: number) => void): Promise<boolean>;
}

/** Placeholder used until a portal SDK is wired: a simple countdown. */
export class SimulatedAdProvider implements AdProvider {
  show(kind: AdKind, onTick?: (remainingSec: number) => void): Promise<boolean> {
    const duration = kind === "rewarded" ? 5 : 3;
    return new Promise((resolve) => {
      let remaining = duration;
      onTick?.(remaining);
      const interval = setInterval(() => {
        remaining -= 1;
        onTick?.(remaining);
        if (remaining <= 0) {
          clearInterval(interval);
          resolve(true);
        }
      }, 1000);
    });
  }
}
