import { C } from "./palette";
import { Gfx } from "./gfx";
import { textWidth } from "./font";
import { GLASS, SCREEN, type Theme } from "./room";
import { PROPS } from "./props";
import {
  COIN_FRAMES,
  HEART,
  KNIGHT_FRAMES,
  KNIGHT_PIXELS,
  POTION,
  SLIME_FRAMES,
} from "./art";

/** Returns the vertical offset of a prop that drops in after `delay` seconds. */
export type Drop = (delay: number) => number;

export interface StageArt {
  theme: Theme;
  /** 0 = idle hands, 1 = typing away. */
  typing: number;
  /** Daylight drowns out the monitor's rim light on the player. */
  daylight?: boolean;
  sky(g: Gfx, t: number): void;
  props(g: Gfx, t: number, p: number, drop: Drop): void;
  /** Draws the monitor, in screen space (64x42). `p` is the scroll progress through the stage. */
  screen(g: Gfx, t: number, p: number, age: number): void;
}

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));

// Deterministic pseudo random, so the scene looks the same on every visit.
function rng(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

const STARS = (() => {
  const r = rng(7);
  return Array.from({ length: 16 }, () => ({ x: Math.floor(r() * GLASS.w), y: Math.floor(r() * (GLASS.h - 8)), s: r() * 6 + 1 }));
})();

function stars(g: Gfx, t: number, count: number, maxY = GLASS.h): void {
  STARS.slice(0, count).forEach((st, i) => {
    if (st.y > maxY) return;
    const tw = Math.sin(t * st.s * 0.7 + i * 1.7);
    if (tw < -0.55) return;
    const x = GLASS.x + st.x;
    const y = GLASS.y + st.y;
    g.px(x, y, tw > 0.6 ? C.white : i % 3 === 0 ? C.yellow : C.silver);
    if (i % 5 === 0 && tw > 0.75) {
      g.px(x - 1, y, C.fog);
      g.px(x + 1, y, C.fog);
      g.px(x, y - 1, C.fog);
      g.px(x, y + 1, C.fog);
    }
  });
}

/** Vertical bands of colour with dithered seams, top to bottom. */
function bands(g: Gfx, colors: string[]): void {
  const h = Math.ceil(GLASS.h / colors.length);
  colors.forEach((c, i) => g.rect(GLASS.x, GLASS.y + i * h, GLASS.w, h + 1, c));
  colors.forEach((c, i) => {
    if (i === 0) return;
    const y = GLASS.y + i * h;
    g.dither(GLASS.x, y, GLASS.w, 2, colors[i - 1], 8);
    g.dither(GLASS.x, y - 2, GLASS.w, 2, c, 4);
  });
}

function check(g: Gfx, x: number, y: number, c: string): void {
  g.px(x, y + 2, c);
  g.px(x + 1, y + 3, c);
  g.px(x + 2, y + 2, c);
  g.px(x + 3, y + 1, c);
  g.px(x + 4, y, c);
}

function spinner(g: Gfx, x: number, y: number, t: number, c: string): void {
  const ring = [
    [1, 0],
    [2, 0],
    [3, 1],
    [3, 2],
    [2, 3],
    [1, 3],
    [0, 2],
    [0, 1],
  ];
  const head = Math.floor(t * 12) % ring.length;
  for (let k = 0; k < 3; k++) {
    const [dx, dy] = ring[(head - k + ring.length) % ring.length];
    g.px(x + dx, y + dy + 1, k === 0 ? c : C.steel);
  }
}

/** A dithered trapezoid of light, from a narrow top edge to a wider bottom edge. */
function cone(g: Gfx, top: number, bottom: number, from: [number, number], to: [number, number], c: string, level: number): void {
  for (let y = top; y < bottom; y++) {
    const k = (y - top) / (bottom - top);
    const l = Math.round(from[0] + (to[0] - from[0]) * k);
    const r = Math.round(from[1] + (to[1] - from[1]) * k);
    g.dither(l, y, r - l, 1, c, level);
  }
}

// ---------------------------------------------------------------------------
// STAGE 0 — title screen, night
// ---------------------------------------------------------------------------

const title: StageArt = {
  theme: {
    wall: C.night,
    wallDot: C.slate,
    wainscot: C.plum,
    wainscotLine: C.ink,
    trim: C.bark,
    floor: C.plum,
    floorLine: C.ink,
    floorHi: C.bark,
    glow: C.slate,
  },
  typing: 0,
  sky(g, t) {
    bands(g, [C.ink, C.ink, C.night]);
    stars(g, t, 14);
    g.disc(GLASS.x + 35, GLASS.y + 10, 5, C.sand);
    g.disc(GLASS.x + 33, GLASS.y + 8, 5, C.ink);
  },
  props(g, _t, _p, drop) {
    g.sprite(PROPS.books, 168, 18 + drop(0.1));

    // Desk lamp throwing a warm, dithered pool of light.
    cone(g, 74, 96, [185, 194], [167, 197], C.gold, 2);
    g.dither(164, 96, 36, 6, C.yellow, 5);
    g.sprite(PROPS.lamp, 184, 62 + drop(0.2));

    g.sprite(PROPS.plant, 0, 103 + drop(0.3));
  },
  screen(g, t, _p, age) {
    g.rect(0, 0, SCREEN.w, SCREEN.h, C.ink);
    g.text("TONGSTAR OS", 2, 2, C.cyan);
    g.hline(2, 8, 43, C.navy);
    g.text("READY.", 2, 11, C.silver);
    const lines = ["> HELLO, WORLD!", "> PRESS START"];
    let typed = Math.max(0, Math.floor((age - 0.6) * 14));
    let cx = 2;
    let cy = 18;
    lines.forEach((line, i) => {
      const shown = line.slice(0, Math.max(0, typed));
      typed -= line.length + 4;
      if (!shown) return;
      const y = 18 + i * 7;
      const w = g.text(shown, 2, y, i === 1 ? C.yellow : C.white);
      cx = 2 + w + 2;
      cy = y;
    });
    if (Math.floor(t * 2) % 2 === 0) g.rect(cx, cy, 3, 5, C.cyan);
  },
};

// ---------------------------------------------------------------------------
// STAGE 1 — day job: infotainment test pipelines
// ---------------------------------------------------------------------------

const PIPELINE = ["CHECKOUT", "DOCKER UP", "EMULATOR", "APPIUM", "ROBOT TESTS", "REPORT"];

const devops: StageArt = {
  theme: {
    wall: C.silver,
    wallDot: C.white,
    wainscot: C.fog,
    wainscotLine: C.steel,
    trim: C.white,
    floor: C.bark,
    floorLine: C.plum,
    floorHi: C.wood,
    glow: null,
  },
  typing: 1,
  daylight: true,
  sky(g, t) {
    bands(g, [C.blue, C.blue, C.cyan]);
    g.disc(GLASS.x + 37, GLASS.y + 8, 4, C.yellow);
    g.px(GLASS.x + 36, GLASS.y + 7, C.white);
    const span = GLASS.w + 24;
    [0, 0.5].forEach((off, i) => {
      const x = GLASS.x - 12 + ((t * (3 + i) + off * span) % span);
      const y = GLASS.y + 16 + i * 12;
      g.rect(x, y, 12, 3, C.white);
      g.rect(x + 3, y - 2, 6, 2, C.white);
      g.hline(x, y + 3, 12, C.silver);
    });
  },
  props(g, t, _p, drop) {
    // Shipping containers on the shelf.
    g.sprite(PROPS.containers, 168, 20 + drop(0.1));

    // Infotainment test bench; the robot stands on the desk beside it and presses its buttons.
    const bx = 167;
    const by = 69 + drop(0.2);
    g.sprite(PROPS.bench, bx, by);
    const sx = bx + 4;
    const sy = by + 4;
    g.text("12:00", sx + 1, sy + 1, C.cyan);
    for (let i = 0; i < 3; i++) g.vline(sx + 22 + i * 2, sy + 4 - i, i + 1, C.silver);
    g.rect(sx + 1, sy + 7, 6, 5, C.pink);
    g.rect(sx + 2, sy + 8, 4, 3, C.gold);
    g.hline(sx + 8, sy + 8, 6, C.silver);
    g.hline(sx + 8, sy + 10, 4, C.fog);
    const tap = Math.floor(t / 0.55) % 2 === 1;
    g.rect(sx + 15, sy + 7, 6, 5, tap ? C.white : C.lime);
    const rx = tap ? 195 : 196;
    const ry = 79 + drop(0.3);
    g.sprite(PROPS.robot, rx, ry);
    if (Math.floor(t * 2) % 2 === 0) {
      g.px(rx + 9, ry, C.yellow);
      g.px(rx + 10, ry, C.yellow);
    }

    // Server rack with blinking status LEDs.
    const kx = 2;
    const ky = 99 + drop(0.25);
    g.sprite(PROPS.rack, kx, ky);
    [6, 12, 17, 23, 29, 35].forEach((uy, u) => {
      const blink = Math.sin(t * (3 + u * 1.3) + u * 2) > 0.2;
      g.px(kx + 3, ky + uy, blink ? C.lime : C.forest);
      g.px(kx + 3, ky + uy + 2, (u + Math.floor(t * 4)) % 3 === 0 ? C.gold : C.bark);
    });
  },
  screen(g, t, p) {
    g.rect(0, 0, SCREEN.w, SCREEN.h, C.ink);
    const done = PIPELINE.map((_, i) => p > 0.08 + i * 0.11);
    const allDone = done.every(Boolean);
    g.rect(0, 0, SCREEN.w, 6, allDone ? C.green : C.navy);
    g.text("BUILD #128", 2, 0, C.white);
    const status = allDone ? "PASS" : "RUN";
    g.text(status, SCREEN.w - 2 - textWidth(status), 0, allDone ? C.white : C.yellow);
    const running = done.indexOf(false);
    PIPELINE.forEach((name, i) => {
      const y = 7 + i * 6;
      if (done[i]) {
        check(g, 1, y, C.lime);
        g.text(name, 8, y, C.silver);
      } else if (i === running) {
        spinner(g, 1, y, t, C.yellow);
        g.text(name, 8, y, C.yellow);
      } else {
        g.px(2, y + 2, C.steel);
        g.text(name, 8, y, C.steel);
      }
    });
    if (allDone && Math.floor(t * 2) % 2 === 0) g.rect(SCREEN.w - 7, 37, 5, 4, C.lime);
  },
};

// ---------------------------------------------------------------------------
// STAGE 2 — side quest: pixel-art indie game
// ---------------------------------------------------------------------------

const SWATCHES = [C.red, C.wine, C.silver, C.fog, C.steel, C.blue, C.gold, C.skin, C.ink, C.white, C.lime, C.pink];

const gamedev: StageArt = {
  theme: {
    wall: C.grape,
    wallDot: C.pink,
    wainscot: C.plum,
    wainscotLine: C.ink,
    trim: C.bark,
    floor: C.bark,
    floorLine: C.plum,
    floorHi: C.wood,
    glow: C.pink,
  },
  typing: 0.6,
  sky(g, t) {
    bands(g, [C.grape, C.pink, C.salmon, C.gold]);
    g.disc(GLASS.x + 23, GLASS.y + GLASS.h, 9, C.yellow);
    g.dither(GLASS.x, GLASS.y + GLASS.h - 3, GLASS.w, 3, C.orange, 8);
    [0, 1].forEach((i) => {
      const x = GLASS.x + ((t * 4 + i * 19) % (GLASS.w + 10)) - 5;
      const y = GLASS.y + 9 + i * 6 + (Math.floor(t * 3 + i) % 2);
      const flap = Math.floor(t * 5 + i) % 2;
      g.px(x - 1, y - flap, C.plum);
      g.px(x, y, C.plum);
      g.px(x + 1, y - flap, C.plum);
    });
  },
  props(g, t, _p, drop) {
    const hop = Math.floor(t * 3) % 2;
    g.sprite(SLIME_FRAMES[hop], 168, 29 - (hop ? 0 : 1) + drop(0));
    g.sprite(HEART, 184, 30 + drop(0.08) + (Math.floor(t * 2) % 2));
    g.sprite(POTION, 196, 29 + drop(0.16));
    g.sprite(POTION, 203, 29 + drop(0.2));

    // Cartridge stack and a controller.
    g.sprite(PROPS.games, 168, 85 + drop(0.2));

    // Arcade cabinet running its attract mode.
    const ax = 0;
    const ay = 97 + drop(0.25);
    g.sprite(PROPS.arcade, ax, ay);
    g.rect(ax + 8, ay + 9, 11, 12, C.ink);
    const march = Math.floor(t * 2) % 4;
    const shift = march < 2 ? march : 4 - march;
    [C.cyan, C.lime, C.salmon].forEach((c, i) => {
      const ix = ax + 9 + i * 3 + shift;
      const iy = ay + 11 + (i % 2) * 3;
      g.hline(ix, iy, 2, c);
      g.px(ix + (Math.floor(t * 4) % 2), iy + 1, c);
    });
    g.hline(ax + 12 + (Math.floor(t * 1.5) % 3), ay + 19, 3, C.white);
    const coin = Math.floor(t * 1.5) % 2 === 0;
    g.px(ax + 14, ay + 33, coin ? C.red : C.wine);
    g.px(ax + 16, ay + 33, coin ? C.wine : C.red);
  },
  screen(g, t, p) {
    g.rect(0, 0, SCREEN.w, SCREEN.h, C.slate);
    g.rect(0, 0, SCREEN.w, 4, C.night);
    [C.red, C.gold, C.lime].forEach((c, i) => g.px(2 + i * 2, 1, c));
    g.rect(0, 4, 6, 38, C.night);
    for (let i = 0; i < 4; i++) g.rect(1, 6 + i * 6, 4, 4, i === 0 ? C.gold : C.steel);
    g.rect(57, 4, 7, 38, C.night);
    SWATCHES.forEach((c, i) => g.rect(58 + (i % 2) * 3, 6 + Math.floor(i / 2) * 4, 2, 3, c));

    // Canvas with transparency checkerboard.
    const cx = 7;
    const cy = 5;
    const cw = 49;
    const ch = 36;
    for (let y = 0; y < ch; y += 2) {
      for (let x = 0; x < cw; x += 2) g.rect(cx + x, cy + y, 2, 2, ((x + y) / 2) % 2 ? C.fog : C.silver);
    }

    const kx = cx + 10;
    const ky = cy + 2;
    const n = Math.floor(clamp01(p / 0.7) * KNIGHT_PIXELS.length);
    if (n >= KNIGHT_PIXELS.length) {
      const frame = KNIGHT_FRAMES[Math.floor(t * 3) % 2];
      g.ctx.drawImage(frame, kx + g.ox, ky + g.oy, frame.width * 2, frame.height * 2);
      if (Math.floor(t * 2) % 2 === 0) {
        g.px(kx - 3, ky + 4, C.white);
        g.px(kx + 30, ky + 10, C.yellow);
      }
    } else {
      for (let i = 0; i < n; i++) {
        const px = KNIGHT_PIXELS[i];
        g.rect(kx + px.x * 2, ky + px.y * 2, 2, 2, px.c);
      }
      const last = KNIGHT_PIXELS[Math.max(0, n - 1)];
      const ex = kx + last.x * 2 + 2;
      const ey = ky + last.y * 2 - 3;
      g.px(ex, ey + 2, C.gold);
      g.px(ex + 1, ey + 1, C.white);
      g.px(ex + 2, ey, C.white);
    }
  },
};

// ---------------------------------------------------------------------------
// STAGE 3 — side quest: quant research
// ---------------------------------------------------------------------------

interface Candle {
  o: number;
  c: number;
  h: number;
  l: number;
}

function series(seed: number, vol: number, drift: number): Candle[] {
  const r = rng(seed);
  let price = 50;
  return Array.from({ length: 14 }, () => {
    const o = price;
    const c = o + (r() - 0.5) * vol + drift;
    const h = Math.max(o, c) + r() * vol * 0.4;
    const l = Math.min(o, c) - r() * vol * 0.4;
    price = c;
    return { o, c, h, l };
  });
}

const MARKETS = [
  { name: "BTC/USD", data: series(11, 9, 1.6) },
  { name: "S&P 500", data: series(5, 4, 0.9) },
];

const TICKER = "BTC/USD ^   S&P 500 ^   SIGNAL: ???   ";

const CITY = (() => {
  const r = rng(3);
  const out: { x: number; w: number; h: number; windows: { x: number; y: number; c: string; blink: boolean }[] }[] = [];
  for (let x = GLASS.x; x < GLASS.x + GLASS.w; ) {
    const w = 5 + Math.floor(r() * 6);
    const h = 10 + Math.floor(r() * 20);
    const top = GLASS.y + GLASS.h - h;
    const windows: { x: number; y: number; c: string; blink: boolean }[] = [];
    for (let wy = top + 3; wy < GLASS.y + GLASS.h - 2; wy += 3) {
      for (let wx = x + 1; wx < x + w - 1; wx += 2) {
        const roll = r();
        if (roll > 0.55) windows.push({ x: wx, y: wy, c: r() > 0.5 ? C.gold : C.yellow, blink: roll > 0.95 });
      }
    }
    out.push({ x, w, h, windows });
    x += w + 1;
  }
  return out;
})();

const quant: StageArt = {
  theme: {
    wall: C.deep,
    wallDot: C.forest,
    wainscot: C.ink,
    wainscotLine: C.deep,
    trim: C.forest,
    floor: C.plum,
    floorLine: C.ink,
    floorHi: C.bark,
    glow: C.forest,
  },
  typing: 0.8,
  sky(g, t) {
    bands(g, [C.ink, C.ink, C.night]);
    stars(g, t, 9, 18);
    for (const b of CITY) {
      const top = GLASS.y + GLASS.h - b.h;
      g.rect(b.x, top, b.w, b.h, C.night);
      g.hline(b.x, top, b.w, C.slate);
      for (const w of b.windows) {
        if (w.blink && Math.floor(t * 0.7 + w.x) % 3 === 0) continue;
        g.px(w.x, w.y, w.c);
      }
    }
  },
  props(g, t, _p, drop) {
    // LED ticker on the shelf.
    const ty = drop(0);
    g.rect(167, 24 + ty, 45, 12, C.ink);
    g.rect(168, 25 + ty, 43, 10, C.slate);
    g.rect(169, 26 + ty, 41, 8, C.ink);
    g.clip(169, 26 + ty, 41, 8, () => {
      const w = textWidth(TICKER) + 4;
      const off = Math.floor(t * 14) % w;
      for (let k = 0; k < 3; k++) g.text(TICKER, 170 - off + k * w, 28 + ty, C.lime);
    });

    // A stack of coins with a notepad, and one coin spinning on its edge.
    g.sprite(PROPS.coins, 168, 82 + drop(0.15));
    const spin = [0, 1, 2, 1][Math.floor(t * 8) % 4];
    g.sprite(COIN_FRAMES[spin], 200, 84 + Math.round(Math.sin(t * 4) * 1.5) + drop(0.25));
    g.hline(201, 97, 6, C.bark);

    // The research pipeline lives in here.
    const vx = 0;
    const vy = 115 + drop(0.2);
    g.sprite(PROPS.safe, vx, vy);
    const a = t * 1.3;
    g.px(vx + 12 + Math.round(Math.cos(a) * 2), vy + 12 + Math.round(Math.sin(a) * 2), C.white);
    g.rect(vx, vy - 8, 25, 8, C.ink);
    g.rect(vx + 1, vy - 7, 23, 6, C.red);
    g.text("SECRET", vx + 1, vy - 7, C.white);
  },
  screen(g, t, p) {
    g.rect(0, 0, SCREEN.w, SCREEN.h, C.ink);
    const market = MARKETS[p < 0.5 ? 0 : 1];
    const local = p < 0.5 ? p / 0.5 : (p - 0.5) / 0.5;
    g.text(market.name, 2, 1, C.gold);
    g.text("1D", SCREEN.w - 2 - textWidth("1D"), 1, C.fog);
    for (const y of [12, 21, 30]) for (let x = 1; x < SCREEN.w; x += 3) g.px(x, y, C.night);

    const data = market.data;
    const lo = Math.min(...data.map((d) => d.l));
    const hi = Math.max(...data.map((d) => d.h));
    const top = 8;
    const bottom = 34;
    const yOf = (v: number) => Math.round(bottom - ((v - lo) / (hi - lo)) * (bottom - top));
    const count = Math.min(data.length, Math.floor(clamp01(local / 0.8) * data.length) + 1);
    let prev: { x: number; y: number } | null = null;
    for (let i = 0; i < count; i++) {
      const d = data[i];
      const live = i === count - 1 && count < data.length;
      const close = live ? d.o + (d.c - d.o) * (0.6 + Math.sin(t * 6) * 0.4) : d.c;
      const up = close >= d.o;
      const x = 3 + i * 4;
      const col = up ? C.lime : C.red;
      g.vline(x + 1, yOf(d.h), yOf(d.l) - yOf(d.h) + 1, up ? C.green : C.wine);
      const y0 = yOf(Math.max(d.o, close));
      const y1 = yOf(Math.min(d.o, close));
      g.rect(x, y0, 3, Math.max(1, y1 - y0 + 1), col);
      const ma = { x: x + 1, y: yOf((d.o + close) / 2) - 3 };
      if (prev) g.line(prev.x, prev.y, ma.x, ma.y, C.yellow);
      prev = ma;
    }
    g.text("EDGE:", 2, 36, C.fog);
    g.text("????", 24, 36, Math.floor(t * 2) % 2 ? C.red : C.salmon);
  },
};

export const STAGES: StageArt[] = [title, devops, gamedev, quant];
