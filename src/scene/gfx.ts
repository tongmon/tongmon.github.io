import { glyph } from "./font";

export type Sprite = HTMLCanvasElement;

export function makeCanvas(w: number, h: number): HTMLCanvasElement {
  const c = document.createElement("canvas");
  c.width = Math.max(1, w);
  c.height = Math.max(1, h);
  return c;
}

export function context(c: HTMLCanvasElement): CanvasRenderingContext2D {
  const ctx = c.getContext("2d")!;
  ctx.imageSmoothingEnabled = false;
  return ctx;
}

/**
 * Builds a sprite from ASCII art. Each line is one row; each character is looked up in `pal`.
 * Characters missing from the palette (".") are transparent. Indentation is ignored.
 */
export function sprite(art: string, pal: Record<string, string>): Sprite {
  const rows = art
    .split("\n")
    .map((r) => r.trim())
    .filter((r) => r.length > 0);
  const w = Math.max(...rows.map((r) => r.length));
  const c = makeCanvas(w, rows.length);
  const ctx = context(c);
  rows.forEach((row, y) => {
    [...row].forEach((ch, x) => {
      const col = pal[ch];
      if (!col) return;
      ctx.fillStyle = col;
      ctx.fillRect(x, y, 1, 1);
    });
  });
  return c;
}

// 4x4 Bayer matrix, values 0..15 — the backbone of every dithered gradient in the scene.
export const BAYER = [
  [0, 8, 2, 10],
  [12, 4, 14, 6],
  [3, 11, 1, 9],
  [15, 7, 13, 5],
];

/** Integer-only drawing helpers with a movable origin. */
export class Gfx {
  ox = 0;
  oy = 0;

  constructor(readonly ctx: CanvasRenderingContext2D) {
    ctx.imageSmoothingEnabled = false;
  }

  at(ox: number, oy: number): this {
    this.ox = Math.round(ox);
    this.oy = Math.round(oy);
    return this;
  }

  rect(x: number, y: number, w: number, h: number, c: string): void {
    if (w <= 0 || h <= 0) return;
    this.ctx.fillStyle = c;
    this.ctx.fillRect(Math.round(x) + this.ox, Math.round(y) + this.oy, Math.round(w), Math.round(h));
  }

  px(x: number, y: number, c: string): void {
    this.rect(x, y, 1, 1, c);
  }

  hline(x: number, y: number, w: number, c: string): void {
    this.rect(x, y, w, 1, c);
  }

  vline(x: number, y: number, h: number, c: string): void {
    this.rect(x, y, 1, h, c);
  }

  line(x0: number, y0: number, x1: number, y1: number, c: string): void {
    x0 = Math.round(x0);
    y0 = Math.round(y0);
    x1 = Math.round(x1);
    y1 = Math.round(y1);
    const dx = Math.abs(x1 - x0);
    const dy = -Math.abs(y1 - y0);
    const sx = x0 < x1 ? 1 : -1;
    const sy = y0 < y1 ? 1 : -1;
    let err = dx + dy;
    this.ctx.fillStyle = c;
    for (;;) {
      this.ctx.fillRect(x0 + this.ox, y0 + this.oy, 1, 1);
      if (x0 === x1 && y0 === y1) break;
      const e2 = 2 * err;
      if (e2 >= dy) {
        err += dy;
        x0 += sx;
      }
      if (e2 <= dx) {
        err += dx;
        y0 += sy;
      }
    }
  }

  /** Filled circle with crisp pixel edges. */
  disc(cx: number, cy: number, r: number, c: string): void {
    for (let dy = -r; dy <= r; dy++) {
      const half = Math.floor(Math.sqrt(r * r - dy * dy + r * 0.6));
      this.hline(cx - half, cy + dy, half * 2 + 1, c);
    }
  }

  /** Checkerboard fill. Parity follows absolute canvas pixels so patterns line up across shapes. */
  checker(x: number, y: number, w: number, h: number, c: string, phase = 0): void {
    this.ctx.fillStyle = c;
    for (let yy = 0; yy < h; yy++) {
      for (let xx = 0; xx < w; xx++) {
        const ax = Math.round(x) + xx + this.ox;
        const ay = Math.round(y) + yy + this.oy;
        if ((ax + ay + phase) % 2 === 0) this.ctx.fillRect(ax, ay, 1, 1);
      }
    }
  }

  /** Ordered-dither fill: `level` 0..16 decides how many of every 16 pixels are painted. */
  dither(x: number, y: number, w: number, h: number, c: string, level: number): void {
    this.ctx.fillStyle = c;
    for (let yy = 0; yy < h; yy++) {
      for (let xx = 0; xx < w; xx++) {
        const ax = Math.round(x) + xx + this.ox;
        const ay = Math.round(y) + yy + this.oy;
        if (BAYER[ay & 3][ax & 3] < level) this.ctx.fillRect(ax, ay, 1, 1);
      }
    }
  }

  sprite(s: CanvasImageSource, x: number, y: number): void {
    this.ctx.drawImage(s, Math.round(x) + this.ox, Math.round(y) + this.oy);
  }

  clip(x: number, y: number, w: number, h: number, draw: () => void): void {
    this.ctx.save();
    this.ctx.beginPath();
    this.ctx.rect(Math.round(x) + this.ox, Math.round(y) + this.oy, w, h);
    this.ctx.clip();
    draw();
    this.ctx.restore();
  }

  text(str: string, x: number, y: number, c: string): number {
    let cx = Math.round(x);
    this.ctx.fillStyle = c;
    for (const ch of str) {
      const gl = glyph(ch);
      gl.bits.forEach((row, ry) =>
        row.forEach((on, rx) => {
          if (on) this.ctx.fillRect(cx + rx + this.ox, Math.round(y) + ry + this.oy, 1, 1);
        }),
      );
      cx += gl.w + 1;
    }
    return cx - Math.round(x) - 1;
  }
}
