import { context, makeCanvas } from "./gfx";
import { PROPS } from "./props";

/** The typing hand, in sprite pixels. It lifts by one pixel on alternate frames. */
const HAND = { x: 52, y: 43, w: 10, h: 8 };
/** The monitor's cyan rim light, which daylight washes out. */
const RIM = new Set(["2ce8f5", "0099db"]);
const INK = "181425";

let frames: { night: HTMLCanvasElement[]; day: HTMLCanvasElement[] } | null = null;

const hex = (d: Uint8ClampedArray, i: number) =>
  ((d[i] << 16) | (d[i + 1] << 8) | d[i + 2]).toString(16).padStart(6, "0");

/** Each rim pixel takes the most common colour around it, so the silhouette loses its glow. */
function withoutRim(src: HTMLCanvasElement): HTMLCanvasElement {
  const { width: w, height: h } = src;
  const out = makeCanvas(w, h);
  const ctx = context(out);
  ctx.drawImage(src, 0, 0);
  const img = ctx.getImageData(0, 0, w, h);
  const d = img.data;
  const before = new Uint8ClampedArray(d);
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const i = (y * w + x) * 4;
      if (!before[i + 3] || !RIM.has(hex(before, i))) continue;
      const votes = new Map<string, { n: number; at: number }>();
      for (let dy = -1; dy <= 1; dy++) {
        for (let dx = -1; dx <= 1; dx++) {
          const nx = x + dx;
          const ny = y + dy;
          if ((!dx && !dy) || nx < 0 || ny < 0 || nx >= w || ny >= h) continue;
          const j = (ny * w + nx) * 4;
          const c = hex(before, j);
          if (!before[j + 3] || c === INK || RIM.has(c)) continue;
          const v = votes.get(c);
          if (v) v.n++;
          else votes.set(c, { n: 1, at: j });
        }
      }
      let best = -1;
      let bestVotes = 0;
      for (const { n, at } of votes.values()) if (n > bestVotes) [best, bestVotes] = [at, n];
      if (best >= 0) d.set(before.subarray(best, best + 3), i);
    }
  }
  ctx.putImageData(img, 0, 0);
  return out;
}

function typingFrames(base: HTMLCanvasElement): HTMLCanvasElement[] {
  const lifted = makeCanvas(base.width, base.height);
  const ctx = context(lifted);
  ctx.drawImage(base, 0, 0);
  ctx.clearRect(HAND.x, HAND.y, HAND.w, HAND.h);
  ctx.drawImage(base, HAND.x, HAND.y, HAND.w, HAND.h, HAND.x, HAND.y - 1, HAND.w, HAND.h);
  return [base, lifted];
}

/** The seated player (with chair), or null until the sprite has loaded. */
export function playerFrame(frame: number, daylight: boolean): HTMLCanvasElement | null {
  if (!frames) {
    const img = PROPS.player;
    if (!img.complete || !img.naturalWidth) return null;
    const base = makeCanvas(img.naturalWidth, img.naturalHeight);
    context(base).drawImage(img, 0, 0);
    frames = { night: typingFrames(base), day: typingFrames(withoutRim(base)) };
  }
  return (daylight ? frames.day : frames.night)[frame];
}
