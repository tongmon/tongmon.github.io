import type { Gfx } from "./gfx";
import { PROPS, isLoaded } from "./props";

/** The typing hand, in sprite pixels. It lifts by one pixel on alternate frames. */
const HAND = { x: 52, y: 43, w: 10, h: 8 };

/**
 * Draws the seated player (with chair) straight from the sprite every frame. Nothing is
 * cached from the image: WebKit can report a data-URL image as complete before it is
 * drawable, and a canvas built from it at that moment would stay blank forever.
 * Daylight uses a pre-baked copy without the monitor's rim light (scripts/player-daylight.py).
 */
export function drawPlayerSprite(g: Gfx, x: number, y: number, lift: boolean, daylight: boolean): void {
  const img = daylight ? PROPS.playerDay : PROPS.player;
  if (!isLoaded(img)) return;
  if (!lift) {
    g.sprite(img, x, y);
    return;
  }
  // Everything but the hand, then the hand one pixel higher.
  const ctx = g.ctx;
  const ox = x + g.ox;
  const oy = y + g.oy;
  ctx.save();
  ctx.beginPath();
  ctx.rect(ox, oy, img.naturalWidth, img.naturalHeight);
  ctx.rect(ox + HAND.x, oy + HAND.y, HAND.w, HAND.h);
  ctx.clip("evenodd");
  ctx.drawImage(img, ox, oy);
  ctx.restore();
  ctx.drawImage(img, HAND.x, HAND.y, HAND.w, HAND.h, ox + HAND.x, oy + HAND.y - 1, HAND.w, HAND.h);
}
