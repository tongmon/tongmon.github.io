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
import playerDayUrl from "../assets/sprites/player-day.png?inline";
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
  playerDay: image(playerDayUrl),
  poster: image(posterUrl),
  rack: image(rackUrl),
  robot: image(robotUrl),
  safe: image(safeUrl),
  shelf: image(shelfUrl),
  window: image(windowUrl),
};

export function isLoaded(img: HTMLImageElement): boolean {
  return img.complete && img.naturalWidth > 0;
}

// Wait for the load event, then for decoding: WebKit can report a data-URL image as
// complete before it is drawable. decode() is capped in case a browser never settles it.
function loaded(img: HTMLImageElement): Promise<void> {
  const load = isLoaded(img)
    ? Promise.resolve()
    : new Promise<void>((resolve) => {
        img.addEventListener("load", () => resolve(), { once: true });
        img.addEventListener("error", () => resolve(), { once: true });
      });
  return load.then(() =>
    Promise.race([img.decode().catch(() => undefined), new Promise((resolve) => setTimeout(resolve, 1500))]).then(
      () => undefined,
    ),
  );
}

/** Resolves once every prop can be drawn. Images that fail to load are simply skipped. */
export const propsReady: Promise<void> = Promise.all(Object.values(PROPS).map(loaded)).then(() => undefined);
