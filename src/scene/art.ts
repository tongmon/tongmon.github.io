import { C } from "./palette";
import { context, makeCanvas, outlined, sprite, type Sprite } from "./gfx";

// ---------------------------------------------------------------------------
// Player character: seen from behind, turned towards the monitor on the right.
// ---------------------------------------------------------------------------

const PLAYER_PAL = {
  o: C.ink,
  n: C.night,
  l: C.slate,
  t: C.steel,
  f: C.fog,
  v: C.silver,
  w: C.white,
  c: C.cyan,
  b: C.blue,
  N: C.navy,
  d: C.deep,
  F: C.forest,
  G: C.green,
  L: C.lime,
  s: C.skin,
  S: C.skin2,
  k: C.bark,
  p: C.plum,
};

// Messy hair, glasses, headphones around the neck and a green hoodie, lit by the monitor
// from the right. Painted at high resolution, then sampled down onto the scene grid and
// locked to the palette.
const PLAYER_ART = `
  .......................t.............................
  ...............l...lnnnl.............................
  ..............nl.nnnnnnnnllnnc.......................
  ..............nlnnnnnnlnnnndbtc......................
  ............tnnonnnnnnltnnnnnNdb.....................
  ...........nnooonnnnonltlnnnnnblc....................
  ...........lonnonnnnlnolnnnnnnnc.....................
  ..........nnnnnoonnnltnnnnnonnndc....................
  .........nnnlloonnnltlnnnnnnnnnndlN..................
  .........onnllonnnlllnnnnnnnnnnndN...................
  ........nnnnnnonnnnlnnnnnnnnoonnoc...................
  .........nnnnonllnnnnonnnnnnonnnnN...................
  .........oonnnnnllnonnnnnnnnonpoNt...................
  .........oonnnnnnlnonnnonnoookSol....................
  ..........oonnnonnnnnnnonpkttsft.....................
  ..........oonnnoonnnnnonokSkssSf.....................
  ..........ooonoonnnnnnnooSSSssSt.....................
  ............oooonnnnnnnnoSSsssS......................
  ............oooonnnnnnnnokSsssS......................
  .............noooonnnnnnkkSssSl......................
  ..............ooooonnnnnSSSSSk.......................
  ...........nooooooonpnSSskoodb.......................
  ..........nnnooooonnkpkkSkonndb......................
  .........nntnoonnnnlllllnonntnnc.....................
  .........nnlnoonnnnnnnnnnonntnnd.....................
  .........nnnnoFGLLLLLLLGFoonlnnd.....................
  ........doonooGGGGGGGGGGGLGonnnn.....................
  .......nFFodddFFGFFFGLLLLLGFoooNNn...................
  ......ndFGFFGGGGGGLLLGGGGLGdFGGLcct..................
  ....nFFdFGGFFGGGGGGGGGGGLGdFGLLLLLN..................
  ...nFGGdFFGGFFFFFFFFGGGGGdFGLGGLLLcN.................
  ...FGGGddFFGGGFddFGGGGGGdFGGGGLLLLLN.................
  ..nFGGGFdFFFGGGGGGGGGGFdFGGGGGLLLLLb.................
  ..dFFGGFddFFFGGGGGGGGFdFGGGGGLLLLLLcN................
  ..FdFGGFFddFFFGGGGGGddFGGGGGGLLGGLLLt................
  .nFdFGGGFFddFFFFGGFddFGGGGGGGLGGGLLLb................
  .dFddGGGGFFodFFFFddFFGGGGGGGGLGGGLLLLN...............
  .dFddGGGGFFFddddddFFGGGGGGGFLGGGGGLLLN...............
  .dFddGGGGGFFFFFFFFGGGGGGGGGFGGGGGGLLLLt..............
  .dFddGFGGGGFFFFFFGGGGGGGGGGdGGFGGGLLLGd..............
  .dFdoFFGGGGGFFGGGGGGGGGGGGGdGGFGGGGLLLF..............
  nFFFddFGFGGGGFFFGGGGGGGGGGGFFGFGGGGLLLLN.............
  nFFFFdFGFFGGGGFFFGGGGGFGGGGFdGFGGGGGLLLcb............
  nFFFFoFGFFGGGGFFFFGGGGFGGGGGdGFGGGGGGLLLb............
  nFdFFoFGFFFGGGGFFFFGGGFGGGGGFFFGGGGGGGGLLN...........
  dFdFFoGGFFFGGGGGFFFFGGFFGGGGFdFGGGFGGGGGLF...........
  dFddFoGGFFFFGGGGFFFFFGGFGGGGGddGGGFGGGGGLF...........
  dFFddoGFFFFFFGGGGFFFFGGFFGGGGFdFGGFGGGGGLGd..........
  dFFddoFFFFFFFFGGGGFFFFGFFGGGGGoFGFFGGGGGLGN..........
  dFFddoFFFFFFFFFFGGGFFFFFFFGGGLdFGFFFGGGGLLcNt........
  ndFddodFFFFFFFFFFGGGGFFFFFGGGLdnGFFFGGGGLLLLbt.......
  .odddoddFddFFFFFFFFGGGGFFFGLGGF.dFFFGGFGLGGGGb.......
  .nddddodFddddFFFFFFFGGGGGFFGLLGt.nFFGFFGLGGGGGd......
  ..odddodFFFddddFFFFFFFFGGGGGGLLb..dFFFFGGGGGGGGb.....
  ...odddFFFFddddddddFFFFFFFGGGGGLn..dFdFGGFFGGGGGN....
  ....ooFFFFFFdddddddddFFFFFFFdFFLn..nddFGFFFGGGGFGn...
  ....ndFFddddddddddFFFFFFFddddFFGn...ndGFFFFFGGFFFkt..
  ....oddddddddFFFFFFFFFFdddddFFGFN....nFFFFFFGFdFFssS.
  .....oddddddFdFFFFddddddddFFFFFdd.....ndFFFFFdFFSssSl
  .....ndddddddddddddddddFFFFFddddn.......nodddFFFSsSsk
  ......ddddddddddddddddddddddddddl.........oddFdkSSpSk
  .......nooooooooooooooooooooooon............nnnnnn.n.
`;

/** Region of the typing hand, lifted by a pixel on alternate frames. */
const HAND = { x: 47, y: 56, w: 7, h: 6 };

function playerFrame(lift: number): Sprite {
  const base = sprite(PLAYER_ART, PLAYER_PAL);
  return outlined(base.width, base.height, C.ink, (g) => {
    g.sprite(base, 0, 0);
    if (!lift) return;
    g.ctx.clearRect(HAND.x, HAND.y, HAND.w, HAND.h);
    g.ctx.drawImage(base, HAND.x, HAND.y, HAND.w, HAND.h, HAND.x, HAND.y - lift, HAND.w, HAND.h);
  });
}

export const PLAYER_FRAMES = [playerFrame(0), playerFrame(1)];

export const CHAIR_BACK = outlined(30, 32, C.ink, (g) => {
  for (let y = 0; y < 32; y++) {
    const inset = y < 3 ? 3 - y : y > 28 ? y - 28 : 0;
    g.hline(inset, y, 30 - inset * 2, C.plum);
  }
  g.rect(3, 3, 24, 22, C.bark);
  g.rect(4, 4, 3, 18, C.wood);
  g.hline(5, 3, 20, C.wood);
  for (let x = 6; x < 25; x += 3) g.px(x, 26, C.bark);
});

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

export const ROBOT = [0, 1].map((frame) =>
  sprite(
    frame === 0
      ? `
    ....y.....
    ....o.....
    ..oooooo..
    .ovvvvvvo.
    .ovcovcvo.
    .ovvvvvvo.
    ..oooooo..
    ..ovvvvo..
    .oovffvoo.
    ovovvvvovo
    oo.ovvo.oo
    ...o..o...
    ..oo..oo..
    `
      : `
    ....y.....
    ....o.....
    ..oooooo..
    .ovvvvvvo.
    .ovcovcvo.
    .ovvvvvvo.
    ..oooooo..
    ..ovvvvoooo
    .oovffvovvo
    ovovvvvo.oo
    oo.ovvo....
    ...o..o...
    ..oo..oo..
    `,
    { o: C.ink, v: C.silver, c: C.cyan, f: C.fog, y: C.yellow },
  ),
);

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

export const GAMEPAD = sprite(
  `
  .oooooooooooooooooo.
  ovvvvvvvvvvvvvvvvvvo
  ovnnnnnnnnnnnnnnnnvo
  ovnnonnnnffnnnnnnnvo
  ovnooonnnnnnnnrnrnvo
  ovnnonnnnffnnnnnnnvo
  ovnnnnnnnnnnnnnnnnvo
  ovvvvvvvvvvvvvvvvvvo
  .oooooooooooooooooo.
  `,
  { o: C.ink, v: C.silver, n: C.night, f: C.fog, r: C.red },
);

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

export const MUG = sprite(
  `
  oooooooo...
  owwwwwwvo..
  owrrwrrvooo
  owrrrrrvo.o
  owwrrrwvo.o
  owwwrwwvoo.
  owwwwwwvo..
  .oooooooo..
  `,
  { o: C.ink, w: C.white, v: C.silver, r: C.red },
);

export const BIG_PLANT = outlined(22, 34, C.ink, (g) => {
  const leaf = (cx: number, cy: number, rx: number, ry: number, fill: string, shade: string) => {
    for (let y = -ry; y <= ry; y++) {
      const half = Math.round(rx * Math.sqrt(1 - (y / (ry + 0.5)) ** 2));
      g.hline(cx - half, cy + y, half * 2 + 1, fill);
      g.px(cx + half, cy + y, shade);
    }
    g.line(cx - rx + 1, cy + ry - 1, cx + rx - 1, cy - ry + 1, shade);
  };
  leaf(6, 9, 4, 6, C.green, C.forest);
  leaf(15, 7, 4, 7, C.lime, C.green);
  leaf(10, 4, 3, 4, C.lime, C.green);
  leaf(4, 17, 4, 3, C.lime, C.green);
  leaf(17, 16, 4, 3, C.green, C.forest);
  leaf(11, 14, 3, 5, C.green, C.forest);
  // Terracotta pot.
  for (let y = 22; y < 34; y++) {
    const inset = Math.floor((y - 22) / 4);
    g.hline(3 + inset, y, 16 - inset * 2, C.tan);
    g.px(3 + inset, y, C.peach);
    g.hline(16 - inset, y, 3, C.rust);
  }
  g.rect(2, 21, 18, 3, C.rust);
  g.hline(2, 21, 18, C.tan);
});

export const SMALL_CACTUS = sprite(
  `
  ...o....
  ..olo.o.
  o.olooGo
  oloGoolo
  oGoGolo.
  .oololo.
  ...olo..
  .oooooo.
  .ottttO.
  ..otOo..
  ..oooo..
  `,
  { o: C.ink, l: C.lime, G: C.green, t: C.tan, O: C.rust },
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
