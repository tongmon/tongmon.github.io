import { BAYER, context, Gfx, makeCanvas } from "./gfx";
import { COMP_H, COMP_W, GLASS, SCREEN, drawBackdrop, drawFurniture, drawPlayer, drawSteam, drawWindow } from "./room";
import { STAGES } from "./stages";

const TRANSITION = 0.6;
const WIPE_STRIPS = 14;
const HUD_HEIGHT = 64;

export interface SceneLayout {
  /** CSS pixels from the top of the viewport to the bottom of the desk composition. */
  sceneBottom: number;
  /** Size of one scene pixel, in CSS pixels. */
  pixel: number;
}

function bounce(k: number): number {
  const n = 7.5625;
  const d = 2.75;
  if (k < 1 / d) return n * k * k;
  if (k < 2 / d) return n * (k -= 1.5 / d) * k + 0.75;
  if (k < 2.5 / d) return n * (k -= 2.25 / d) * k + 0.9375;
  return n * (k -= 2.625 / d) * k + 0.984375;
}

/**
 * Renders the pixel-art desk scene into a low-resolution canvas that is scaled up by an
 * integer factor of *device* pixels, so every scene pixel stays perfectly square.
 */
export class Scene {
  private readonly g: Gfx;
  private readonly bufA = makeCanvas(1, 1);
  private readonly bufB = makeCanvas(1, 1);
  private readonly gA = new Gfx(context(this.bufA));
  private readonly gB = new Gfx(context(this.bufB));
  private readonly screen = makeCanvas(SCREEN.w, SCREEN.h);
  private readonly gScreen = new Gfx(context(this.screen));
  private readonly masks: HTMLCanvasElement[] = [];
  private caches: (HTMLCanvasElement | null)[] = STAGES.map(() => null);

  private W = 0;
  private H = 0;
  private ox = 0;
  private oy = 0;

  private stage = 0;
  private prevStage = 0;
  private readonly progress = STAGES.map(() => 0);
  private readonly enteredAt = STAGES.map(() => 0);
  private transitionStart = -Infinity;
  private forward = true;

  private raf = 0;
  private visible = true;
  private readonly t0 = performance.now();

  onLayout?: (layout: SceneLayout) => void;

  constructor(
    private readonly canvas: HTMLCanvasElement,
    private readonly host: HTMLElement,
    private readonly reducedMotion: boolean,
    private readonly textEdge: () => number,
  ) {
    this.g = new Gfx(context(canvas));
    for (let level = 0; level <= 16; level++) {
      const m = makeCanvas(4, 4);
      const mctx = context(m);
      mctx.fillStyle = "#000";
      for (let y = 0; y < 4; y++) for (let x = 0; x < 4; x++) if (BAYER[y][x] < level) mctx.fillRect(x, y, 1, 1);
      this.masks.push(m);
    }
  }

  private now(): number {
    return (performance.now() - this.t0) / 1000;
  }

  resize(): void {
    const dpr = window.devicePixelRatio || 1;
    const vw = this.host.clientWidth;
    const vh = this.host.clientHeight;
    if (!vw || !vh) return;
    const desktop = vw >= 900;
    const edge = desktop ? this.textEdge() : 0;
    const availW = (desktop ? vw - edge - 24 : vw) * dpr;
    const availH = (desktop ? vh * 0.86 : vh * 0.46) * dpr;
    const scale = Math.max(1, Math.floor(Math.min(availW / COMP_W, availH / COMP_H)));

    this.W = Math.ceil((vw * dpr) / scale);
    this.H = Math.ceil((vh * dpr) / scale);
    const cssPx = scale / dpr;
    for (const c of [this.canvas, this.bufA, this.bufB]) {
      c.width = this.W;
      c.height = this.H;
      context(c);
    }
    this.canvas.style.width = `${this.W * cssPx}px`;
    this.canvas.style.height = `${this.H * cssPx}px`;

    if (desktop) {
      const left = edge / cssPx;
      this.ox = Math.round(left + (this.W - left - COMP_W) / 2);
      this.oy = Math.round((this.H - COMP_H) / 2 + this.H * 0.04);
    } else {
      this.ox = Math.round((this.W - COMP_W) / 2);
      this.oy = Math.ceil(HUD_HEIGHT / cssPx);
    }
    this.caches = STAGES.map(() => null);
    this.onLayout?.({ sceneBottom: (this.oy + COMP_H) * cssPx, pixel: cssPx });
    this.draw();
  }

  /** Called on scroll with the active stage and how far the reader is through it (0..1). */
  setStage(index: number, progress: number): void {
    if (index !== this.stage) {
      this.forward = index > this.stage;
      this.prevStage = this.stage;
      this.stage = index;
      this.transitionStart = this.now();
      this.enteredAt[index] = this.transitionStart;
    }
    this.progress[index] = progress;
    if (this.reducedMotion) this.draw();
  }

  /** Rebuilds the cached room layers and repaints, e.g. once sprites have finished loading. */
  redraw(): void {
    this.caches = STAGES.map(() => null);
    this.draw();
  }

  setVisible(visible: boolean): void {
    this.visible = visible;
    if (visible) this.start();
    else this.stop();
  }

  start(): void {
    if (this.raf || !this.visible) return;
    if (this.reducedMotion) {
      this.draw();
      return;
    }
    // Schedule the next frame first, so one failing frame can't stop the animation.
    const loop = () => {
      this.raf = requestAnimationFrame(loop);
      this.draw();
    };
    this.raf = requestAnimationFrame(loop);
  }

  stop(): void {
    cancelAnimationFrame(this.raf);
    this.raf = 0;
  }

  private cache(i: number): HTMLCanvasElement {
    let c = this.caches[i];
    if (!c) {
      c = makeCanvas(this.W, this.H);
      const g = new Gfx(context(c));
      drawBackdrop(g, STAGES[i].theme, this.W, this.H, this.ox, this.oy);
      g.at(this.ox, this.oy);
      drawFurniture(g);
      this.caches[i] = c;
    }
    return c;
  }

  private draw(): void {
    if (!this.W) return;
    const t = this.reducedMotion ? 4 : this.now();
    const k = this.reducedMotion ? 1 : (t - this.transitionStart) / TRANSITION;
    if (k >= 1) {
      this.renderStage(this.g, this.stage, t);
      return;
    }
    this.renderStage(this.gA, this.prevStage, t);
    this.renderStage(this.gB, this.stage, t);

    // Dithered wipe: each vertical strip dissolves a little later than its neighbour.
    const ctx = this.gB.ctx;
    const stripW = Math.ceil(this.W / WIPE_STRIPS);
    const spread = 0.7;
    for (let s = 0; s < WIPE_STRIPS; s++) {
      const order = this.forward ? s : WIPE_STRIPS - 1 - s;
      const local = k * (1 + spread) - (order / (WIPE_STRIPS - 1)) * spread;
      const level = Math.max(0, Math.min(16, Math.round(local * 16)));
      if (level === 16) continue;
      ctx.save();
      ctx.beginPath();
      ctx.rect(s * stripW, 0, stripW, this.H);
      ctx.clip();
      ctx.globalCompositeOperation = "destination-in";
      ctx.fillStyle = ctx.createPattern(this.masks[level], "repeat")!;
      ctx.fillRect(s * stripW, 0, stripW, this.H);
      ctx.restore();
    }
    this.g.ctx.drawImage(this.bufA, 0, 0);
    this.g.ctx.drawImage(this.bufB, 0, 0);
  }

  private renderStage(g: Gfx, i: number, t: number): void {
    const st = STAGES[i];
    const age = this.reducedMotion ? 99 : t - this.enteredAt[i];
    const p = this.progress[i];
    const drop = (delay: number) => {
      const k = (age - delay) / 0.5;
      if (k >= 1) return 0;
      return -Math.round((1 - bounce(Math.max(0, k))) * 9);
    };

    g.at(0, 0);
    g.ctx.drawImage(this.cache(i), 0, 0);
    g.at(this.ox, this.oy);
    g.clip(GLASS.x, GLASS.y, GLASS.w, GLASS.h, () => st.sky(g, t));
    drawWindow(g);
    st.props(g, t, p, drop);

    const sg = this.gScreen.at(0, 0);
    sg.ctx.clearRect(0, 0, SCREEN.w, SCREEN.h);
    st.screen(sg, t, p, age);
    sg.ctx.fillStyle = "rgba(24, 20, 37, 0.22)";
    for (let y = 1; y < SCREEN.h; y += 2) sg.ctx.fillRect(0, y, SCREEN.w, 1);
    g.sprite(this.screen, SCREEN.x, SCREEN.y);

    drawSteam(g, t);
    drawPlayer(g, t, this.reducedMotion ? 0 : st.typing, st.daylight ?? false);
  }
}
