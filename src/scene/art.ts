import { C } from "./palette";
import { context, makeCanvas, sprite } from "./gfx";

// ---------------------------------------------------------------------------
// Monitor content sprites
// ---------------------------------------------------------------------------

const KNIGHT_PAL = { o: C.ink, s: C.silver, S: C.fog, d: C.steel, r: C.red, R: C.wine, w: C.white, k: C.skin, b: C.blue, y: C.gold };

export const KNIGHT_ART = [
  `
  .....rr.......
  ....rrRr......
  ...rrR........
  ..oooooo......
  .osssssSo.....
  .osoooooo.....
  .ossskwwo.....
  .osssssSo...w.
  ..oooooo...ws.
  .obbsssbo..s..
  osbbsssbbooS..
  osbbsssbbyo...
  .obbsssbo.....
  ..oddoddo.....
  ..od..odo.....
  ..oo...oo.....
  `,
  `
  .....rr.......
  ....rrRr......
  ...rrR........
  ..oooooo......
  .osssssSo.....
  .osoooooo.....
  .ossskwwo.....
  .osssssSo..w..
  ..oooooo..ws..
  .obbsssbo.s...
  osbbsssbbooS..
  osbbsssbbyo...
  .obbsssbo.....
  ..odddddo.....
  ..oddoddo.....
  ...oo.oo......
  `,
];

export const KNIGHT_FRAMES = KNIGHT_ART.map((a) => sprite(a, KNIGHT_PAL));

/** Pixels of the first knight frame in painting order (row by row), for the "drawing it live" effect. */
export const KNIGHT_PIXELS: { x: number; y: number; c: string }[] = (() => {
  const rows = KNIGHT_ART[0]
    .split("\n")
    .map((r) => r.trim())
    .filter(Boolean);
  const out: { x: number; y: number; c: string }[] = [];
  rows.forEach((row, y) =>
    [...row].forEach((ch, x) => {
      const c = (KNIGHT_PAL as Record<string, string>)[ch];
      if (c) out.push({ x, y, c });
    }),
  );
  return out;
})();

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

const COIN_PAL = { o: C.ink, y: C.yellow, Y: C.gold, O: C.orange, w: C.white };

export const COIN_FRAMES = [
  `
  ..oooo..
  .oyyyYo.
  oywyyyYo
  oyyYYyYo
  oyyYYyYo
  oyyyyyOo
  .oYYYOo.
  ..oooo..
  `,
  `
  ..ooo..
  .oyyYo.
  .oywYo.
  .oyYYo.
  .oyYYo.
  .oyyOo.
  .oYYOo.
  ..ooo..
  `,
  `
  ...oo...
  ...oYo..
  ...oYo..
  ...oYo..
  ...oYo..
  ...oOo..
  ...oOo..
  ...oo...
  `,
].map((a) => sprite(a, COIN_PAL));

const SLIME_PAL = { o: C.ink, l: C.lime, G: C.green, w: C.white };

export const SLIME_FRAMES = [
  `
  ....oooo....
  ..oollllGo..
  .olwlllllGo.
  .ollollolGo.
  oGllllllllGo
  oGGGGGGGGGGo
  .oooooooooo.
  `,
  `
  ............
  ...oooooo...
  .oolwllllGo.
  ollollollGGo
  oGllllllllGo
  oGGGGGGGGGGo
  .oooooooooo.
  `,
].map((a) => sprite(a, SLIME_PAL));

export const HEART = sprite(
  `
  .oo.oo.
  orwowRo
  orrrrRo
  .orrRo.
  ..oRo..
  ...o...
  `,
  { o: C.ink, r: C.red, R: C.wine, w: C.white },
);

export const POTION = sprite(
  `
  .ooo.
  .obo.
  oosoo
  osppo
  oppPo
  opPPo
  .ooo.
  `,
  { o: C.ink, b: C.bark, s: C.salmon, p: C.pink, P: C.grape },
);

// ---------------------------------------------------------------------------
// Inventory / contact icons (16x16) for the DOM sections.
// ---------------------------------------------------------------------------

const ICON_PAL = {
  o: C.ink,
  w: C.white,
  v: C.silver,
  f: C.fog,
  t: C.steel,
  b: C.blue,
  B: C.navy,
  c: C.cyan,
  y: C.yellow,
  Y: C.gold,
  r: C.red,
  R: C.wine,
  g: C.lime,
  G: C.green,
  p: C.pink,
  P: C.grape,
  n: C.night,
  s: C.sand,
  k: C.bark,
  O: C.orange,
};

export const ICONS: Record<string, string> = {
  window: `
    oooooooooooooo..
    obbbbbbbbbrwro..
    obbbbbbbbbbbbo..
    ovvvvvvvvvvvvo..
    ovwwwwwwwwwwvo..
    ovwccwwwwwwwvo..
    ovwccwffffwwvo..
    ovwwwwwwwwwwvo..
    ovwffffwffwwvo..
    ovwwwwwwwwwwvo..
    ovwffwffffwwvo..
    ovwwwwwwwwwwvo..
    ovvvvvvvvvvvvo..
    oooooooooooooo..
    `,
  chat: `
    .oooooooooo.....
    ogggggggggGo....
    ogwwgwwgwwGo....
    ogggggggggGo....
    oGGGGGGGGGGo....
    .ooooGooooo.....
    ....oGo.oooooooo
    ....oo.obbbbbbbo
    .......obwwbwwbo
    .......obbbbbbbo
    .......oBBBBBBBo
    .......oooooBooo
    ...........oBo..
    ............oo..
    `,
  tag: `
    ......oooooooo..
    .....oYYYYYYYyo.
    ....oYYyyyyyyyo.
    ...oYyyyyyyooyo.
    ..oYyyyyyyyooyo.
    .oYyyyoyyyyyyyo.
    oYyyyoyoyyyyyo..
    oYyyyyoyoyyyo...
    .oYyyyyoyyyo....
    ..oYyyyyyyo.....
    ...oYyyyyo......
    ....oYyyo.......
    .....oYo........
    ......o.........
    `,
  cube: `
    ......oooo......
    ....oopppPoo....
    ..oopppppppPoo..
    oopppppppppppPoo
    oPPpppppppppPPRo
    oPPPPpppppPPRRRo
    oPPPPPPpPPRRRRRo
    oPPPPPPPRRRRRRRo
    oPPPPPPPRRRRRRRo
    oPPPPPPPRRRRRRRo
    oPPPPPPPRRRRRRRo
    .ooPPPPPRRRRRoo.
    ...ooPPPRRRoo...
    .....ooooo......
    `,
  toolbox: `
    .....oooooo.....
    ....ottttto.....
    ....oo....oo....
    oooooooooooooooo
    orrrrrrrrrrrrrRo
    orrrrrrrrrrrrrRo
    oRRRRRoyyoRRRRRo
    oooooooyyooooooo
    orrrrrrrrrrrrrRo
    orrrrrrrrrrrrrRo
    orrrrrrrrrrrrrRo
    oRRRRRRRRRRRRRRo
    oooooooooooooooo
    `,
  book: `
    ..oooooooooooo..
    .obbbbbbbbbbbwo.
    .obwwwwwwwwwbwo.
    .obwyyyyyyywbwo.
    .obwwwwwwwwwbwo.
    .obbbbbbbbbbbwo.
    .obbbbbbbbbbbwo.
    .obbbbbbbbbbbwo.
    .obbbbbbbbbbbwo.
    .obbbbbbbbbbbwo.
    .oBBBBBBBBBBBwo.
    .oBwwwwwwwwwwwo.
    .oBBBBBBBBBBBBo.
    ..oooooooooooo..
    `,
  more: `
    ................
    ......oooo......
    ......oyyo......
    ......oyyo......
    ......oyyo......
    .ooooooyyoooooo.
    .oyyyyyyyyyyyyo.
    .oyyyyyyyyyyyyo.
    .ooooooyyoooooo.
    ......oyyo......
    ......oyyo......
    ......oyyo......
    ......oooo......
    ................
    `,
  mail: `
    oooooooooooooooo
    owwwwwwwwwwwwwwo
    ovwwwwwwwwwwwwvo
    owvwwwwwwwwwwvwo
    owwvvwwwwwwvvwwo
    owwwwvwwwwvwwwwo
    owwwwwvrrvwwwwwo
    owwwwwwrrwwwwwwo
    owwwwwwwwwwwwwwo
    oooooooooooooooo
    `,
  code: `
    ....oo....oo....
    ...ogo....ogo...
    ..ogo..oo..ogo..
    .ogo..ogo...ogo.
    ogo...ogo....ogo
    .ogo.ogo....ogo.
    ..ogoogo...ogo..
    ...ooogo..ogo...
    ....ogo....oo...
    ....oo..........
    `,
  in: `
    oooooooooooooooo
    obbbbbbbbbbbbbbo
    obwwbbbbbbbbbbbo
    obwwbbbbbbbbbbbo
    obbbbbbbbbbbbbbo
    obwwbwwwwwwbbbbo
    obwwbwwbbbwwbbbo
    obwwbwwbbbwwbbbo
    obwwbwwbbbwwbbbo
    obwwbwwbbbwwbbbo
    obbbbbbbbbbbbbbo
    oooooooooooooooo
    `,
  camera: `
    ....oooo........
    ...oppppo.......
    oooooooooooooooo
    oppppppppppppyPo
    opppppoooopppppo
    oppppowwwwopppPo
    opppowbbbcwopppo
    opppowbBbbwopppo
    opppowbbbbwopppo
    oppppowwwwopppPo
    opppppoooopppppo
    oPPPPPPPPPPPPPPo
    oooooooooooooooo
    `,
  star: `
    .......oo.......
    ......oyyo......
    ......oyyo......
    .....oyyyyo.....
    ooooooyyyyoooooo
    oyyyyyywyyyyyyYo
    .oyyyyyyyyyyyYo.
    ..oyyyyyyyyyYo..
    ...oyyyyyyyYo...
    ...oyyyYYyyYo...
    ..oyyYoooYYyYo..
    ..oyYo...oYYYo..
    .oYYo.....oYYo..
    .ooo.......ooo..
    `,
};

const iconCache = new Map<string, string>();

/** Renders an icon centred on a 16x16 canvas and returns it as a data URL, cached. */
export function iconUrl(name: string): string {
  let url = iconCache.get(name);
  if (!url) {
    const art = sprite(ICONS[name] ?? ICONS.more, ICON_PAL);
    const c = makeCanvas(16, 16);
    context(c).drawImage(art, Math.floor((16 - art.width) / 2), Math.floor((16 - art.height) / 2));
    url = c.toDataURL();
    iconCache.set(name, url);
  }
  return url;
}
