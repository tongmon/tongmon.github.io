import { C } from "./scene/palette";
import { context, Gfx, makeCanvas } from "./scene/gfx";

function rng(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

/**
 * Sparse pixel starfield tile. Two tiles of different sizes are layered behind the lower
 * sections so the repetition never lines up.
 */
export function starTile(size: number, seed: number, count: number): string {
  const c = makeCanvas(size, size);
  const g = new Gfx(context(c));
  const r = rng(seed);
  for (let i = 0; i < count; i++) {
    const x = Math.floor(r() * size);
    const y = Math.floor(r() * size);
    const roll = r();
    if (roll > 0.92) {
      g.px(x, y, C.white);
      g.px(x - 1, y, C.steel);
      g.px(x + 1, y, C.steel);
      g.px(x, y - 1, C.steel);
      g.px(x, y + 1, C.steel);
    } else {
      g.px(x, y, roll > 0.6 ? C.steel : C.slate);
    }
  }
  return c.toDataURL();
}

/** Platformer-style grass and dirt strip between the desk scene and the sections. */
export function groundTile(): string {
  const c = makeCanvas(16, 12);
  const g = new Gfx(context(c));
  g.rect(0, 0, 16, 12, C.bark);
  g.rect(0, 0, 16, 3, C.green);
  g.hline(0, 0, 16, C.lime);
  for (const x of [1, 6, 11]) g.px(x, 3, C.green);
  for (const x of [3, 9, 14]) g.px(x, 1, C.lime);
  g.rect(0, 4, 16, 1, C.plum);
  const r = rng(9);
  for (let i = 0; i < 9; i++) g.px(Math.floor(r() * 16), 5 + Math.floor(r() * 7), r() > 0.5 ? C.wood : C.plum);
  return c.toDataURL();
}
