import { C } from "./palette";
import { BAYER, Gfx } from "./gfx";
import { playerFrame } from "./player";
import { PROPS } from "./props";

// Composition space: everything that belongs to the desk scene is laid out in this
// fixed coordinate system and later placed on the canvas at an integer offset.
export const COMP_W = 214;
export const COMP_H = 150;
export const FLOOR_Y = 124;

// Measured from the sprites: the window's empty panes and the monitor's dark screen.
export const WINDOW = { x: 3, y: 7 };
export const GLASS = { x: WINDOW.x + 7, y: WINDOW.y + 4, w: 46, h: 40 };
const MONITOR = { x: 80, y: 24 };
export const SCREEN = { x: MONITOR.x + 9, y: MONITOR.y + 9, w: 64, h: 42 };

export interface Theme {
  wall: string;
  wallDot: string;
  wainscot: string;
  wainscotLine: string;
  trim: string;
  floor: string;
  floorLine: string;
  floorHi: string;
  glow: string | null;
}

/** Wall, floor and light that span the whole canvas, not just the composition. */
export function drawBackdrop(g: Gfx, th: Theme, W: number, H: number, ox: number, oy: number): void {
  g.at(0, 0);
  const floorTop = oy + FLOOR_Y;
  const railTop = floorTop - 24;
  g.rect(0, 0, W, floorTop, th.wall);

  // Wallpaper: a sparse diamond lattice aligned to the composition.
  const mod = (v: number, m: number) => ((v % m) + m) % m;
  for (let y = mod(oy, 8) - 8; y < railTop - 2; y += 8) {
    for (let x = mod(ox, 8) - 8; x < W; x += 8) {
      const odd = mod((y - oy) / 8, 2) === 1;
      const dx = x + 3 + (odd ? 4 : 0);
      g.px(dx, y + 3, th.wallDot);
      g.px(dx - 1, y + 4, th.wallDot);
      g.px(dx + 1, y + 4, th.wallDot);
      g.px(dx, y + 5, th.wallDot);
    }
  }

  // Wainscoting with a chair rail.
  g.rect(0, railTop, W, 2, th.trim);
  g.rect(0, railTop + 2, W, 1, th.wainscotLine);
  g.rect(0, railTop + 3, W, floorTop - railTop - 6, th.wainscot);
  for (let x = mod(ox, 16); x < W; x += 16) g.vline(x, railTop + 5, floorTop - railTop - 10, th.wainscotLine);
  g.rect(0, floorTop - 3, W, 3, th.floorLine);

  // Floor planks.
  g.rect(0, floorTop, W, H - floorTop, th.floor);
  for (let row = 0, y = floorTop; y < H; row++, y += 6) {
    g.hline(0, y + 5, W, th.floorLine);
    g.checker(0, y, W, 1, th.floorHi, row);
    const offset = mod(ox + row * 19, 37);
    for (let x = offset - 37; x < W; x += 37) g.vline(x, y, 5, th.floorLine);
  }

  // Soft light falling off around the monitor, as an ordered dither.
  if (th.glow) {
    const cx = ox + 121;
    const cy = oy + 54;
    const rx = 74;
    const ry = 56;
    g.ctx.fillStyle = th.glow;
    for (let y = Math.max(0, cy - ry); y < Math.min(floorTop - 3, cy + ry); y++) {
      for (let x = Math.max(0, cx - rx); x < Math.min(W, cx + rx); x++) {
        const d = ((x - cx) / rx) ** 2 + ((y - cy) / ry) ** 2;
        if (d >= 1) continue;
        if (BAYER[y & 3][x & 3] < (1 - d) * 7) g.ctx.fillRect(x, y, 1, 1);
      }
    }
  }
}

/** Furniture that never changes between stages. Drawn once per stage into a cached layer. */
export function drawFurniture(g: Gfx): void {
  g.sprite(PROPS.poster, 103, 3);
  g.sprite(PROPS.shelf, 167, 36);
  g.sprite(PROPS.desk, 22, 94);
  g.sprite(PROPS.monitor, MONITOR.x, MONITOR.y);
  g.sprite(PROPS.keyboard, 89, 90);
  g.sprite(PROPS.mug, 150, 87);
}

/** The window frame goes on top of the animated sky, which shows through its empty panes. */
export function drawWindow(g: Gfx): void {
  g.sprite(PROPS.window, WINDOW.x, WINDOW.y);
}

export function drawSteam(g: Gfx, t: number): void {
  for (let i = 0; i < 2; i++) {
    const phase = (t * 0.9 + i * 0.5) % 1;
    const y = 85 - Math.floor(phase * 9);
    const x = 153 + i * 3 + Math.round(Math.sin((t * 3 + i) * 2) * 1);
    if (phase < 0.75) g.px(x, y, phase < 0.4 ? C.white : C.silver);
    if (phase < 0.55) g.px(x, y + 1, C.silver);
  }
}

/** The player, sitting in their chair and turned towards the monitor. */
export function drawPlayer(g: Gfx, t: number, typing: number, daylight: boolean): void {
  // Typing comes in bursts so it reads as someone thinking between keystrokes.
  const burst = (t % 2.6) < 1.6;
  const frame = typing > 0 && burst ? Math.floor(t * (8 + typing * 4)) % 2 : 0;
  const sprite = playerFrame(frame, daylight);
  if (sprite) g.sprite(sprite, 39, 46);
}
