/**
 * Zero-asset sound: every effect is synthesized on the fly with the Web Audio
 * API (oscillators + noise), so there are no audio files to ship or load.
 * A muted master gain and a lazy AudioContext keep it SSR-safe and let the
 * player toggle sound. Combo pitch rises with the kill streak for that
 * escalating dopamine feedback.
 */

type Wave = OscillatorType;

export class Sfx {
  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  private _enabled = true;

  get enabled(): boolean {
    return this._enabled;
  }

  setEnabled(on: boolean): void {
    this._enabled = on;
    if (this.master) this.master.gain.value = on ? 0.9 : 0;
  }

  /** must be called from a user gesture (click/keydown) to satisfy autoplay */
  resume(): void {
    this.ensure();
    if (this.ctx && this.ctx.state === "suspended") void this.ctx.resume();
  }

  private ensure(): void {
    if (this.ctx || typeof window === "undefined") return;
    const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AC) return;
    this.ctx = new AC();
    this.master = this.ctx.createGain();
    this.master.gain.value = this._enabled ? 0.9 : 0;
    this.master.connect(this.ctx.destination);
  }

  private tone(
    freq: number,
    dur: number,
    opts: { type?: Wave; gain?: number; slideTo?: number; delay?: number; attack?: number } = {},
  ): void {
    if (!this._enabled) return;
    this.ensure();
    const ctx = this.ctx;
    const master = this.master;
    if (!ctx || !master) return;
    const t0 = ctx.currentTime + (opts.delay ?? 0);
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = opts.type ?? "sine";
    osc.frequency.setValueAtTime(freq, t0);
    if (opts.slideTo) osc.frequency.exponentialRampToValueAtTime(Math.max(1, opts.slideTo), t0 + dur);
    const peak = opts.gain ?? 0.3;
    const atk = opts.attack ?? 0.005;
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.exponentialRampToValueAtTime(peak, t0 + atk);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    osc.connect(g);
    g.connect(master);
    osc.start(t0);
    osc.stop(t0 + dur + 0.02);
  }

  private noise(dur: number, opts: { gain?: number; lowpass?: number; delay?: number } = {}): void {
    if (!this._enabled) return;
    this.ensure();
    const ctx = this.ctx;
    const master = this.master;
    if (!ctx || !master) return;
    const t0 = ctx.currentTime + (opts.delay ?? 0);
    const frames = Math.floor(ctx.sampleRate * dur);
    const buffer = ctx.createBuffer(1, frames, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < frames; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / frames);
    const src = ctx.createBufferSource();
    src.buffer = buffer;
    const g = ctx.createGain();
    g.gain.setValueAtTime(opts.gain ?? 0.3, t0);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    let node: AudioNode = src;
    if (opts.lowpass) {
      const lp = ctx.createBiquadFilter();
      lp.type = "lowpass";
      lp.frequency.value = opts.lowpass;
      src.connect(lp);
      node = lp;
    }
    node.connect(g);
    g.connect(master);
    src.start(t0);
    src.stop(t0 + dur + 0.02);
  }

  /** orb pickup — pitch climbs with the current combo for a rising "streak" feel */
  eat(combo = 0): void {
    const base = 420 + Math.min(24, combo) * 40;
    this.tone(base, 0.08, { type: "triangle", gain: 0.18, slideTo: base * 1.5 });
  }

  /** you ate another blob */
  kill(streak = 1): void {
    const p = 1 + Math.min(8, streak) * 0.12;
    this.tone(180 * p, 0.18, { type: "sawtooth", gain: 0.32, slideTo: 90 * p });
    this.tone(360 * p, 0.14, { type: "square", gain: 0.14, slideTo: 180 * p, delay: 0.01 });
    this.noise(0.16, { gain: 0.25, lowpass: 1400 });
  }

  /** boost / dash whoosh */
  boost(): void {
    this.noise(0.22, { gain: 0.2, lowpass: 900 });
    this.tone(220, 0.2, { type: "sawtooth", gain: 0.1, slideTo: 520 });
  }

  /** grabbed a power-up */
  power(): void {
    [523, 659, 784, 1047].forEach((f, i) => this.tone(f, 0.12, { type: "triangle", gain: 0.2, delay: i * 0.05 }));
  }

  /** you died */
  death(): void {
    this.tone(300, 0.5, { type: "sawtooth", gain: 0.3, slideTo: 60 });
    this.noise(0.4, { gain: 0.25, lowpass: 800, delay: 0.02 });
  }

  /** mid-run level up / milestone jingle */
  levelUp(): void {
    [659, 784, 988, 1319].forEach((f, i) => this.tone(f, 0.16, { type: "square", gain: 0.16, delay: i * 0.06 }));
  }

  /** reached #1 on the board */
  fanfare(): void {
    [523, 659, 784, 1047, 1319].forEach((f, i) =>
      this.tone(f, 0.3, { type: "triangle", gain: 0.18, delay: i * 0.08 }),
    );
  }

  /** UI click */
  click(): void {
    this.tone(660, 0.05, { type: "square", gain: 0.12 });
  }

  /** crate reveal sparkle */
  crate(): void {
    this.tone(880, 0.1, { type: "triangle", gain: 0.2, slideTo: 1760 });
    this.tone(1320, 0.2, { type: "sine", gain: 0.15, delay: 0.08 });
  }
}

/** single shared instance (client-only usage) */
export const sfx = new Sfx();
