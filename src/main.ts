import "./styles/main.css";
import { en } from "./content/en";
import { ko } from "./content/ko";
import type { Content, Lang } from "./content/types";
import { formatTime, renderHud, renderSections, renderSteps, STAGE_IDS } from "./render";
import { propsReady } from "./scene/props";
import { Scene } from "./scene/scene";
import { groundTile, starTile } from "./textures";

const CONTENT: Record<Lang, Content> = { en, ko };
const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const root = document.documentElement;
const hud = document.getElementById("hud")!;
const story = document.getElementById("story")!;
const stageEl = document.getElementById("stage")!;
const stepsEl = document.getElementById("steps")!;
const sectionsEl = document.getElementById("sections")!;
const canvas = document.getElementById("scene") as HTMLCanvasElement;

root.style.setProperty("--tex-stars", `url(${starTile(96, 42, 14)}), url(${starTile(131, 7, 20)})`);
root.style.setProperty("--tex-ground", `url(${groundTile()})`);

function initialLang(): Lang {
  const q = new URLSearchParams(location.search).get("lang");
  if (q === "en" || q === "ko") return q;
  try {
    const saved = localStorage.getItem("lang");
    if (saved === "en" || saved === "ko") return saved;
  } catch {
    // Storage can be unavailable (private mode); English is the default anyway.
  }
  return "en";
}

let lang = initialLang();
let content = CONTENT[lang];

// ---------------------------------------------------------------------------
// Typewriter for dialog lines and stage titles.
// ---------------------------------------------------------------------------

const typedSteps = new Set<number>();

function typewrite(el: HTMLElement): void {
  if (reduced || el.dataset.typing) return;
  el.dataset.typing = "1";
  const chars = [...(el.textContent ?? "")];
  el.textContent = "";
  const spans = chars.map((ch) => {
    const s = document.createElement("span");
    s.className = "tw";
    s.textContent = ch;
    el.appendChild(s);
    return s;
  });
  let i = 0;
  const tick = () => {
    if (!el.isConnected) return;
    const next = Math.min(spans.length, i + 2);
    for (; i < next; i++) spans[i].classList.add("on");
    if (i < spans.length) window.setTimeout(tick, 28);
  };
  tick();
}

function typeStep(index: number): void {
  if (typedSteps.has(index)) return;
  typedSteps.add(index);
  stepsEl.querySelectorAll<HTMLElement>(`[data-step="${index}"] [data-type]`).forEach(typewrite);
}

// ---------------------------------------------------------------------------
// Scene + scroll-driven story
// ---------------------------------------------------------------------------

const scene = new Scene(canvas, stageEl, reduced, () => {
  const inner = stepsEl.querySelector<HTMLElement>(".step:not(.step--hero) .step__inner");
  return inner ? inner.getBoundingClientRect().right : window.innerWidth * 0.45;
});
scene.onLayout = ({ sceneBottom }) => root.style.setProperty("--scene-bottom", `${Math.round(sceneBottom)}px`);

let activeStep = -1;

function updateStory(): void {
  const vh = window.innerHeight;
  const steps = stepsEl.querySelectorAll<HTMLElement>(".step");
  let index = 0;
  let progress = 0;
  steps.forEach((el, i) => {
    const r = el.getBoundingClientRect();
    if (r.top <= vh * 0.5) {
      index = i;
      progress = Math.min(1, Math.max(0, (vh * 0.5 - r.top) / r.height));
    }
  });
  scene.setStage(index, progress);

  if (index !== activeStep) {
    activeStep = index;
    steps.forEach((el, i) => el.classList.toggle("is-active", i === index));
    document.body.dataset.stage = String(index);
    const id = STAGE_IDS[index];
    canvas.setAttribute("aria-label", content.sceneLabels[id]);
    const label = document.getElementById("dots-label");
    if (label) label.textContent = `${index > 0 ? `${content.ui.stage} ${index} · ` : ""}${content.ui.stageNames[id]}`;
    hud.querySelectorAll<HTMLElement>(".dots__dot").forEach((d, i) => {
      d.classList.toggle("is-on", i === index);
      d.classList.toggle("is-done", i < index);
      if (i === index) d.setAttribute("aria-current", "step");
      else d.removeAttribute("aria-current");
    });
    typeStep(index);
  }

  const sr = story.getBoundingClientRect();
  hud.classList.toggle("is-story", sr.bottom > vh * 0.6);
}

let scrollQueued = false;
function onScroll(): void {
  if (scrollQueued) return;
  scrollQueued = true;
  requestAnimationFrame(() => {
    scrollQueued = false;
    updateStory();
  });
}

new IntersectionObserver((entries) => scene.setVisible(entries[0].isIntersecting)).observe(story);

// ---------------------------------------------------------------------------
// Reveal-on-scroll, record counters, countdown
// ---------------------------------------------------------------------------

function runCounter(el: HTMLElement): void {
  const from = Number(el.dataset.from);
  const to = Number(el.dataset.to);
  const out = el.querySelector<HTMLElement>(".record__time");
  if (!out || reduced) {
    el.classList.add("is-done");
    return;
  }
  const start = performance.now();
  const dur = 1700;
  const frame = (now: number) => {
    const k = Math.min(1, (now - start) / dur);
    const eased = 1 - (1 - k) ** 3;
    out.textContent = formatTime(from + (to - from) * eased);
    if (k < 1) requestAnimationFrame(frame);
    else el.classList.add("is-done");
  };
  out.textContent = formatTime(from);
  requestAnimationFrame(frame);
}

let revealObserver: IntersectionObserver | null = null;

function observeReveals(instantAbove: boolean): void {
  revealObserver?.disconnect();
  revealObserver = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (!e.isIntersecting) continue;
        const el = e.target as HTMLElement;
        el.classList.add("is-in");
        revealObserver!.unobserve(el);
        if (el.classList.contains("record")) runCounter(el);
      }
    },
    { rootMargin: "0px 0px -12% 0px", threshold: 0.1 },
  );
  const vh = window.innerHeight;
  document.querySelectorAll<HTMLElement>(".reveal").forEach((el) => {
    if (reduced || (instantAbove && el.getBoundingClientRect().top < vh)) {
      el.classList.add("is-in", "is-done");
      return;
    }
    revealObserver!.observe(el);
  });
}

let countdownTimer = 0;
function setupCountdown(): void {
  window.clearInterval(countdownTimer);
  const el = document.getElementById("countdown");
  const section = document.getElementById("contact");
  if (!el || !section || reduced) return;
  let n = 9;
  let visible = false;
  new IntersectionObserver((entries) => (visible = entries[0].isIntersecting)).observe(section);
  countdownTimer = window.setInterval(() => {
    if (!visible) return;
    n = n === 0 ? 9 : n - 1;
    el.textContent = String(n);
    el.classList.remove("tick");
    void el.offsetWidth;
    el.classList.add("tick");
  }, 1000);
}

// ---------------------------------------------------------------------------
// Rendering + language switching
// ---------------------------------------------------------------------------

function bindHud(): void {
  document.getElementById("lang")?.addEventListener("click", toggleLang);
  hud.querySelectorAll<HTMLButtonElement>(".dots__dot").forEach((btn) =>
    btn.addEventListener("click", () => {
      const i = Number(btn.dataset.goto);
      const step = stepsEl.querySelector<HTMLElement>(`[data-step="${i}"]`);
      if (!step) return;
      const top = i === 0 ? 0 : step.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({ top });
    }),
  );
}

function render(isSwitch: boolean): void {
  content = CONTENT[lang];
  root.lang = lang;
  document.title = content.meta.title;
  document.querySelector('meta[name="description"]')?.setAttribute("content", content.meta.description);
  hud.innerHTML = renderHud(content);
  stepsEl.innerHTML = renderSteps(content);
  sectionsEl.innerHTML = renderSections(content);
  bindHud();
  observeReveals(isSwitch);
  setupCountdown();
  activeStep = -1;
  updateStory();
}

function toggleLang(): void {
  // Keep the reader anchored to whatever block is at the top of the screen.
  const blocks = [...document.querySelectorAll<HTMLElement>(".step, .section")];
  const anchor = blocks.find((el) => el.getBoundingClientRect().bottom > 80);
  const selector = anchor ? (anchor.dataset.step !== undefined ? `[data-step="${anchor.dataset.step}"]` : `#${anchor.id}`) : null;
  const offset = anchor?.getBoundingClientRect().top ?? 0;

  lang = lang === "en" ? "ko" : "en";
  try {
    localStorage.setItem("lang", lang);
  } catch {
    // Ignore: the choice just won't persist.
  }
  const url = new URL(location.href);
  if (url.searchParams.has("lang")) {
    url.searchParams.set("lang", lang);
    history.replaceState(null, "", url);
  }
  typedSteps.delete(activeStep);
  render(true);
  scene.resize();

  const again = selector ? document.querySelector<HTMLElement>(selector) : null;
  if (again) window.scrollBy({ top: again.getBoundingClientRect().top - offset, behavior: "instant" });
  document.getElementById("lang")?.focus();
}

// Menu-style keyboard navigation in the CONTINUE? screen.
document.addEventListener("keydown", (e) => {
  const items = [...document.querySelectorAll<HTMLElement>(".menu__item")];
  const i = items.indexOf(document.activeElement as HTMLElement);
  if (i < 0 || (e.key !== "ArrowDown" && e.key !== "ArrowUp")) return;
  e.preventDefault();
  items[(i + (e.key === "ArrowDown" ? 1 : items.length - 1)) % items.length].focus();
});

// ↑ ↑ ↓ ↓ ← → ← → B A
const KONAMI = ["ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown", "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight", "b", "a"];
let konami = 0;
document.addEventListener("keydown", (e) => {
  konami = e.key.toLowerCase() === KONAMI[konami].toLowerCase() ? konami + 1 : e.key === KONAMI[0] ? 1 : 0;
  if (konami === KONAMI.length) {
    konami = 0;
    document.body.classList.toggle("crt");
  }
});

render(false);
scene.resize();
scene.start();

let resizeQueued = false;
window.addEventListener("resize", () => {
  if (resizeQueued) return;
  resizeQueued = true;
  requestAnimationFrame(() => {
    resizeQueued = false;
    scene.resize();
    updateStory();
  });
});
window.addEventListener("scroll", onScroll, { passive: true });
document.fonts?.ready.then(() => scene.resize());
propsReady.then(() => scene.redraw());
