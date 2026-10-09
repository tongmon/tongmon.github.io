import { C } from "./palette";
import { BAYER, Gfx } from "./gfx";
import { BODY_FRAMES, CHAIR_BACK, HEAD, MUG } from "./art";

// Composition space: everything that belongs to the desk scene is laid out in this
// fixed coordinate system and later placed on the canvas at an integer offset.
export const COMP_W = 214;
export const COMP_H = 144;
export const FLOOR_Y = 124;

export const WINDOW = { x: 6, y: 8, w: 52, h: 50 };
export const GLASS = { x: 9, y: 11, w: 46, h: 44 };
export const SCREEN = { x: 89, y: 31, w: 64, h: 42 };

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
  drawWindowFrame(g);
  drawPoster(g);
  drawShelf(g);
  drawDesk(g);
  drawMonitor(g);
  drawDeskItems(g);
}

function drawWindowFrame(g: Gfx): void {
  const { x, y, w, h } = WINDOW;
  g.rect(x - 1, y - 1, w + 2, h + 2, C.plum);
  g.rect(x, y, w, h, C.wood);
  g.hline(x, y, w, C.peach);
  g.vline(x, y, h, C.peach);
  g.rect(GLASS.x - 1, GLASS.y - 1, GLASS.w + 2, GLASS.h + 2, C.bark);
  // Sill.
  g.rect(x - 4, y + h - 1, w + 8, 4, C.wood);
  g.hline(x - 4, y + h - 1, w + 8, C.peach);
  g.hline(x - 4, y + h + 3, w + 8, C.plum);
}

export function drawMullions(g: Gfx): void {
  const mx = GLASS.x + GLASS.w / 2 - 1;
  const my = GLASS.y + GLASS.h / 2 - 1;
  g.rect(mx, GLASS.y, 2, GLASS.h, C.wood);
  g.vline(mx, GLASS.y, GLASS.h, C.peach);
  g.rect(GLASS.x, my, GLASS.w, 2, C.wood);
  g.hline(GLASS.x, my, GLASS.w, C.peach);
  // A glint on the glass.
  g.px(GLASS.x + 3, GLASS.y + 3, C.white);
  g.px(GLASS.x + 4, GLASS.y + 2, C.white);
  g.px(GLASS.x + 2, GLASS.y + 4, C.white);
}

function drawPoster(g: Gfx): void {
  const x = 104;
  const y = 3;
  g.rect(x, y, 34, 18, C.plum);
  g.rect(x + 1, y + 1, 32, 16, C.bark);
  g.rect(x + 2, y + 2, 30, 14, C.blue);
  g.rect(x + 2, y + 2, 30, 4, C.navy);
  g.dither(x + 2, y + 6, 30, 2, C.navy, 6);
  g.disc(x + 24, y + 7, 2, C.yellow);
  for (let i = 0; i < 30; i++) {
    const hgt = Math.max(0, 7 - Math.abs(((i + 3) % 14) - 7));
    g.vline(x + 2 + i, y + 16 - hgt, hgt, C.green);
    if (hgt > 5) g.px(x + 2 + i, y + 16 - hgt, C.white);
  }
  g.hline(x + 2, y + 15, 30, C.forest);
}

function drawShelf(g: Gfx): void {
  g.rect(166, 36, 47, 3, C.wood);
  g.hline(166, 36, 47, C.peach);
  g.hline(166, 39, 47, C.plum);
  for (const bx of [170, 206]) {
    g.rect(bx, 40, 2, 5, C.bark);
    g.px(bx + 2, 40, C.bark);
  }
}

function drawDesk(g: Gfx): void {
  // Left leg and the drawer cabinet on the right.
  g.rect(26, 106, 6, 36, C.bark);
  g.vline(26, 106, 36, C.wood);
  g.vline(31, 106, 36, C.plum);
  g.rect(166, 106, 42, 36, C.plum);
  g.rect(167, 106, 40, 35, C.wood);
  for (const dy of [109, 125]) {
    g.rect(170, dy, 34, 13, C.bark);
    g.rect(171, dy + 1, 32, 11, C.wood);
    g.hline(171, dy + 1, 32, C.peach);
    g.rect(183, dy + 5, 8, 2, C.gold);
    g.hline(183, dy + 7, 8, C.plum);
  }
  // Top surface seen slightly from above, then the front edge.
  g.hline(22, 95, 192, C.plum);
  g.rect(22, 96, 192, 6, C.wood);
  g.hline(22, 96, 192, C.peach);
  g.checker(22, 98, 192, 3, C.tan, 1);
  g.rect(22, 102, 192, 4, C.bark);
  g.hline(22, 102, 192, C.wood);
  g.hline(22, 106, 192, C.plum);
}

function drawMonitor(g: Gfx): void {
  // Stand first so the bezel overlaps it.
  g.rect(113, 82, 16, 9, C.ink);
  g.rect(114, 82, 14, 8, C.fog);
  g.vline(114, 82, 8, C.silver);
  g.vline(126, 82, 8, C.steel);
  g.rect(103, 90, 36, 7, C.ink);
  g.rect(104, 90, 34, 6, C.fog);
  g.hline(104, 90, 34, C.silver);
  g.hline(104, 95, 34, C.steel);

  // Bezel.
  g.rect(81, 23, 80, 62, C.ink);
  g.rect(82, 24, 78, 60, C.silver);
  g.hline(82, 24, 78, C.white);
  g.vline(82, 24, 60, C.white);
  g.vline(159, 25, 59, C.fog);
  g.hline(83, 83, 77, C.fog);
  // Screen recess.
  g.rect(SCREEN.x - 2, SCREEN.y - 2, SCREEN.w + 4, SCREEN.h + 4, C.fog);
  g.rect(SCREEN.x - 1, SCREEN.y - 1, SCREEN.w + 2, SCREEN.h + 2, C.ink);
  // Chin: vents, badge and power LED.
  for (let i = 0; i < 5; i++) g.hline(88 + i * 3, 78, 2, C.fog);
  g.text("TS", 117, 76, C.steel);
  g.rect(148, 78, 3, 2, C.ink);
  g.rect(149, 78, 1, 1, C.lime);
}

function drawDeskItems(g: Gfx): void {
  // Keyboard.
  g.rect(89, 96, 48, 5, C.ink);
  g.rect(90, 96, 46, 4, C.silver);
  g.hline(90, 96, 46, C.white);
  for (let x = 91; x < 135; x += 2) {
    g.px(x, 97, C.fog);
    g.px(x + 1, 98, C.fog);
  }
  g.hline(90, 99, 46, C.steel);
  // Mouse.
  g.rect(139, 96, 6, 5, C.ink);
  g.rect(140, 96, 4, 4, C.silver);
  g.hline(140, 96, 4, C.white);
  g.px(141, 97, C.fog);
  // Mug.
  g.sprite(MUG, 148, 91);
}

export function drawSteam(g: Gfx, t: number): void {
  for (let i = 0; i < 2; i++) {
    const phase = (t * 0.9 + i * 0.5) % 1;
    const y = 89 - Math.floor(phase * 9);
    const x = 151 + i * 3 + Math.round(Math.sin((t * 3 + i) * 2) * 1);
    if (phase < 0.75) g.px(x, y, phase < 0.4 ? C.white : C.silver);
    if (phase < 0.55) g.px(x, y + 1, C.silver);
  }
}

/** The player: head, hoodie, typing arm, then the chair in front of them. */
export function drawPlayer(g: Gfx, t: number, typing: number): void {
  // Typing comes in bursts so it reads as someone thinking between keystrokes.
  const burst = (t % 2.6) < 1.6;
  const frame = typing > 0 && burst ? Math.floor(t * (8 + typing * 4)) % 2 : 0;
  g.sprite(HEAD, 54, 35);
  g.sprite(BODY_FRAMES[frame], 45, 55);

  // Chair: seat peeking out on both sides, backrest, then the base on the floor.
  g.rect(42, 111, 42, 6, C.ink);
  g.rect(43, 112, 40, 4, C.plum);
  g.hline(43, 112, 40, C.bark);
  g.sprite(CHAIR_BACK, 47, 84);
  g.rect(60, 118, 6, 11, C.ink);
  g.rect(61, 118, 4, 10, C.steel);
  g.vline(61, 118, 10, C.fog);
  g.line(62, 128, 46, 132, C.slate);
  g.line(63, 128, 80, 132, C.slate);
  g.line(62, 129, 47, 133, C.ink);
  g.line(63, 129, 79, 133, C.ink);
  g.rect(61, 128, 4, 6, C.slate);
  for (const wx of [44, 61, 78]) {
    g.rect(wx, 133, 4, 3, C.ink);
    g.px(wx + 1, 133, C.steel);
  }
}
