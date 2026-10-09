import portraitUrl from "./assets/images/portrait.png";
import { iconUrl } from "./scene/art";
import { contacts, items, moreUrl, records } from "./content/profile";
import type { Content, StageId } from "./content/types";

const esc = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

export const STAGE_IDS: StageId[] = ["title", "devops", "gamedev", "quant"];

export function formatTime(seconds: number): string {
  const s = Math.max(0, seconds);
  const mm = Math.floor(s / 60);
  const ss = Math.floor(s % 60);
  const cc = Math.floor((s * 100) % 100);
  return `${String(mm).padStart(2, "0")}:${String(ss).padStart(2, "0")}.${String(cc).padStart(2, "0")}`;
}

export function renderHud(c: Content): string {
  const dots = STAGE_IDS.map(
    (id, i) =>
      `<button class="dots__dot" type="button" data-goto="${i}" aria-label="${esc(`${c.ui.goToStage} ${c.ui.stageNames[id]}`)}"></button>`,
  ).join("");
  return `
    <a class="hud__brand" href="#top" aria-label="tongstar">
      <img src="${iconUrl("star")}" alt="" width="32" height="32" />
      <span>TONGSTAR</span>
    </a>
    <div class="dots" id="dots">
      <span class="dots__label" id="dots-label">${esc(c.ui.stageNames.title)}</span>
      <span class="dots__row">${dots}</span>
    </div>
    <nav class="hud__nav" aria-label="Sections">
      <a href="#log">${esc(c.ui.nav.log)}</a>
      <a href="#records">${esc(c.ui.nav.records)}</a>
      <a href="#items">${esc(c.ui.nav.items)}</a>
      <a href="#contact">${esc(c.ui.nav.contact)}</a>
    </nav>
    <button class="px-btn hud__lang" id="lang" type="button" aria-label="${esc(c.ui.langLabel)}">${esc(c.ui.langButton)}</button>`;
}

export function renderSteps(c: Content): string {
  const hero = `
    <article class="step step--hero" data-step="0" aria-labelledby="hero-title">
      <div class="step__inner hero">
        <p class="hero__eyebrow"><span class="blink" aria-hidden="true">►</span> ${esc(c.hero.eyebrow)}</p>
        <h1 class="logo" id="hero-title" data-text="TONGSTAR">TONGSTAR</h1>
        <p class="hero__tagline"><span>${esc(c.hero.taglineTop)}</span> <span>${esc(c.hero.taglineBottom)}</span></p>
        <div class="dialog px-box">
          <img class="dialog__portrait" src="${portraitUrl}" width="64" height="64" alt="" />
          <div class="dialog__body">
            <p class="dialog__speaker">${esc(c.hero.speaker)}</p>
            <p class="dialog__text" data-type>${esc(c.hero.greeting)}</p>
          </div>
          <span class="dialog__next blink" aria-hidden="true">▼</span>
        </div>
        <p class="hero__hint"><span class="bob" aria-hidden="true">▼</span> ${esc(c.hero.hint)}</p>
      </div>
    </article>`;

  const stages = c.stages
    .map((s, i) => {
      const note =
        s.note === undefined
          ? ""
          : s.id === "quant"
            ? `<p class="stamp" aria-hidden="true">${esc(s.note)}</p>`
            : `<p class="panel__note"><span class="blink" aria-hidden="true">■</span> ${esc(s.note)}</p>`;
      return `
    <article class="step" data-step="${i + 1}" id="stage-${s.id}" aria-labelledby="stage-${s.id}-title">
      <div class="step__inner panel px-box">
        <p class="panel__tag">${esc(s.tag)}</p>
        <h2 class="panel__title" id="stage-${s.id}-title" data-type>${esc(s.title)}</h2>
        ${s.body.map((b) => `<p class="panel__body">${esc(b)}</p>`).join("")}
        <div class="gear">
          <p class="gear__label">${esc(s.gearLabel)}</p>
          <ul class="gear__list">${s.gear.map((g, j) => `<li class="chip" style="--d:${300 + j * 70}">${esc(g)}</li>`).join("")}</ul>
        </div>
        ${note}
      </div>
    </article>`;
    })
    .join("");

  return hero + stages;
}

function sectionHead(id: string, title: string, sub: string, icon: string): string {
  return `
    <header class="section__head reveal">
      <h2 class="section__title" id="${id}-title"><img src="${iconUrl(icon)}" alt="" width="32" height="32" />${esc(title)}</h2>
      <p class="section__sub">${esc(sub)}</p>
    </header>`;
}

export function renderSections(c: Content): string {
  const quests = c.questLog.entries
    .map(
      (q, i) => `
      <li class="quest quest--${q.status} reveal" style="--i:${i}">
        <span class="quest__marker" aria-hidden="true"></span>
        <div class="quest__card px-box">
          <p class="quest__meta"><span class="badge badge--${q.status}">${esc(q.statusLabel)}</span><span class="quest__period">${esc(q.period)}</span></p>
          <h3 class="quest__role">${esc(q.role)}${q.org ? ` <span class="quest__org">@ ${esc(q.org)}</span>` : ""}</h3>
          <ul class="quest__list">${q.bullets.map((b) => `<li>${esc(b)}</li>`).join("")}</ul>
        </div>
      </li>`,
    )
    .join("");

  const recs = records
    .map((r, i) => {
      const copy = c.records.items[i];
      const pct = Math.round((1 - r.to / r.from) * 100);
      return `
      <article class="record px-box reveal" style="--i:${i}" data-from="${r.from}" data-to="${r.to}">
        <p class="record__label">${esc(copy.label)}</p>
        <p class="record__old"><s>${formatTime(r.from)}</s></p>
        <p class="record__time" aria-label="${formatTime(r.from)} → ${formatTime(r.to)}">${formatTime(r.to)}</p>
        <p class="record__delta">▼ ${pct}%</p>
        <p class="record__how">${esc(copy.how)}</p>
        <p class="record__new">${esc(c.records.newRecord)}</p>
      </article>`;
    })
    .join("");

  const inv = items
    .map((it, i) => {
      const copy = c.inventory.items[i];
      return `
      <li class="item item--${it.rarity} reveal" style="--i:${i}">
        <a class="item__link" href="${it.url}" target="_blank" rel="noopener">
          <span class="item__slot"><img src="${iconUrl(it.icon)}" alt="" width="48" height="48" /></span>
          <span class="item__text">
            <span class="item__rarity">${esc(copy.rarity)}</span>
            <span class="item__name">${esc(it.name)}</span>
            <span class="item__desc">${esc(copy.desc)}</span>
            <span class="item__meta"><span>${esc(it.lang)}</span>${it.stars > 0 ? `<span aria-label="${it.stars} ${esc(c.inventory.stars)}">★ ${it.stars}</span>` : ""}</span>
          </span>
        </a>
      </li>`;
    })
    .join("");

  const more = `
      <li class="item item--more reveal" style="--i:${items.length}">
        <a class="item__link" href="${moreUrl}" target="_blank" rel="noopener">
          <span class="item__slot"><img src="${iconUrl("more")}" alt="" width="48" height="48" /></span>
          <span class="item__text">
            <span class="item__name">${esc(c.inventory.more)}</span>
            <span class="item__desc">${esc(c.inventory.moreDesc)}</span>
          </span>
        </a>
      </li>`;

  const menu = contacts
    .map((ct, i) => {
      const external = ct.href.startsWith("http");
      return `
      <li class="reveal" style="--i:${i}">
        <a class="menu__item" href="${ct.href}"${external ? ' target="_blank" rel="noopener"' : ""}>
          <span class="menu__cursor" aria-hidden="true">►</span>
          <img src="${iconUrl(ct.icon)}" alt="" width="32" height="32" />
          <span class="menu__label">${esc(c.contact.links[i].label)}</span>
          <span class="menu__value">${esc(ct.value)}</span>
        </a>
      </li>`;
    })
    .join("");

  return `
    <div class="ground" aria-hidden="true"></div>
    <section class="section" id="log" aria-labelledby="log-title">
      ${sectionHead("log", c.questLog.title, c.questLog.subtitle, "book")}
      <ol class="quests">${quests}</ol>
    </section>
    <section class="section" id="records" aria-labelledby="records-title">
      ${sectionHead("records", c.records.title, c.records.subtitle, "star")}
      <div class="records">${recs}</div>
    </section>
    <section class="section" id="items" aria-labelledby="items-title">
      ${sectionHead("items", c.inventory.title, c.inventory.subtitle, "toolbox")}
      <ul class="inventory">${inv}${more}</ul>
    </section>
    <section class="section continue" id="contact" aria-labelledby="contact-title">
      <div class="arcade px-box reveal" id="arcade" data-state="count">
        <div class="arcade__screen">
          <div class="arcade__count">
            <h2 class="continue__title" id="contact-title">${esc(c.contact.title)}</h2>
            <p class="continue__count" id="countdown" aria-hidden="true">9</p>
          </div>
          <div class="arcade__over" aria-live="polite">
            <p class="over__title">${esc(c.contact.gameOver)}</p>
            <p class="over__thanks">${esc(c.contact.thanks)}</p>
            <div class="credits" id="credits">
              <dl class="credits__roll">${c.contact.credits
                .map(([role, name]) => `<div><dt>${esc(role)}</dt><dd>${esc(name)}</dd></div>`)
                .join("")}</dl>
            </div>
            <div class="over__menu">
              <button class="px-btn" type="button" id="continue-game"><span aria-hidden="true">► </span>${esc(c.contact.continueGame)}</button>
              <button class="px-btn" type="button" id="new-game"><span aria-hidden="true">► </span>${esc(c.contact.newGame)}</button>
            </div>
          </div>
        </div>
      </div>
      <p class="continue__prompt reveal">${esc(c.contact.prompt)}</p>
      <ul class="menu" id="menu">${menu}</ul>
      <p class="continue__coin" aria-hidden="true"><img class="coin-drop" id="coin-drop" src="${iconUrl("coin")}" alt="" width="32" height="32" /><span id="coin-text" class="blink" data-insert="${esc(c.contact.insertCoin)}" data-credit="${esc(c.contact.credit)}">${esc(c.contact.insertCoin)}</span></p>
    </section>
    <footer class="footer"><p>${esc(c.contact.footer)}</p></footer>`;
}
