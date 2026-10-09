// Language-independent facts. Copy that changes per language lives in en.ts / ko.ts,
// in the same order as the arrays below.

export const profile = {
  handle: "tongstar",
  siteUrl: "https://tongmon.github.io/",
} as const;

export interface RecordFact {
  /** Seconds before / after the optimization. */
  from: number;
  to: number;
}

export const records: RecordFact[] = [
  { from: 45 * 60, to: 8 * 60 },
  { from: 5 * 60, to: 3 },
  { from: 16, to: 6 },
];

export type ItemIcon = "window" | "chat" | "tag" | "cube" | "toolbox" | "book";
export type Rarity = "legendary" | "epic" | "rare" | "uncommon";

export interface ItemFact {
  name: string;
  url: string;
  lang: string;
  stars: number;
  icon: ItemIcon;
  rarity: Rarity;
}

export const items: ItemFact[] = [
  { name: "qt-frameless-windows", url: "https://github.com/tongmon/qt-frameless-windows", lang: "C++ · Qt/QML", stars: 33, icon: "window", rarity: "legendary" },
  { name: "Minigram", url: "https://github.com/tongmon/Minigram", lang: "C++ · Qt", stars: 0, icon: "chat", rarity: "epic" },
  { name: "onchak-extension", url: "https://github.com/tongmon/onchak-extension", lang: "HTML · JS", stars: 0, icon: "tag", rarity: "rare" },
  { name: "graphics-engine-practice", url: "https://github.com/tongmon/graphics-engine-practice", lang: "C++", stars: 0, icon: "cube", rarity: "rare" },
  { name: "desktop-client-practice", url: "https://github.com/tongmon/desktop-client-practice", lang: "C", stars: 1, icon: "toolbox", rarity: "uncommon" },
  { name: "fundamental-practice", url: "https://github.com/tongmon/fundamental-practice", lang: "C++", stars: 2, icon: "book", rarity: "uncommon" },
];

export const moreUrl = "https://github.com/tongmon?tab=repositories";

export type ContactIcon = "mail" | "code" | "in" | "camera";

export interface ContactFact {
  href: string;
  value: string;
  icon: ContactIcon;
}

export const contacts: ContactFact[] = [
  { href: "mailto:tongmon@hanmail.net", value: "tongmon@hanmail.net", icon: "mail" },
  { href: "https://github.com/tongmon", value: "@tongmon", icon: "code" },
  { href: "https://www.linkedin.com/in/kjl19970309", value: "in/kjl19970309", icon: "in" },
  { href: "https://www.instagram.com/kyungjoon_1997/", value: "@kyungjoon_1997", icon: "camera" },
];
