// Furniture and props live as palette-locked PNGs in src/assets/sprites, so they can be opened and
// touched up in Aseprite. They are inlined into the bundle to avoid extra requests.
import arcadeUrl from "../assets/sprites/arcade.png?inline";
import benchUrl from "../assets/sprites/bench.png?inline";
import booksUrl from "../assets/sprites/books.png?inline";
import coinsUrl from "../assets/sprites/coins.png?inline";
import containersUrl from "../assets/sprites/containers.png?inline";
import deskUrl from "../assets/sprites/desk.png?inline";
import gamesUrl from "../assets/sprites/games.png?inline";
import keyboardUrl from "../assets/sprites/keyboard.png?inline";
import lampUrl from "../assets/sprites/lamp.png?inline";
import monitorUrl from "../assets/sprites/monitor.png?inline";
import mugUrl from "../assets/sprites/mug.png?inline";
import plantUrl from "../assets/sprites/plant.png?inline";
import playerUrl from "../assets/sprites/player.png?inline";
import posterUrl from "../assets/sprites/poster.png?inline";
import rackUrl from "../assets/sprites/rack.png?inline";
import robotUrl from "../assets/sprites/robot.png?inline";
import safeUrl from "../assets/sprites/safe.png?inline";
import shelfUrl from "../assets/sprites/shelf.png?inline";
import windowUrl from "../assets/sprites/window.png?inline";

function image(src: string): HTMLImageElement {
  const img = new Image();
  img.src = src;
  return img;
}

export const PROPS = {
  arcade: image(arcadeUrl),
  bench: image(benchUrl),
  books: image(booksUrl),
  coins: image(coinsUrl),
  containers: image(containersUrl),
  desk: image(deskUrl),
  games: image(gamesUrl),
  keyboard: image(keyboardUrl),
  lamp: image(lampUrl),
  monitor: image(monitorUrl),
  mug: image(mugUrl),
  plant: image(plantUrl),
  player: image(playerUrl),
  poster: image(posterUrl),
  rack: image(rackUrl),
  robot: image(robotUrl),
  safe: image(safeUrl),
  shelf: image(shelfUrl),
  window: image(windowUrl),
};

/** Resolves once every prop can be drawn. Images that fail to decode are simply skipped. */
export const propsReady: Promise<void> = Promise.all(
  Object.values(PROPS).map((img) => img.decode().catch(() => undefined)),
).then(() => undefined);
