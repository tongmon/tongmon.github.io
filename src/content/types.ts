export type Lang = "en" | "ko";

export type StageId = "title" | "devops" | "gamedev" | "quant";

export interface HeroCopy {
  eyebrow: string;
  taglineTop: string;
  taglineBottom: string;
  speaker: string;
  greeting: string;
  hint: string;
}

export interface StageCopy {
  id: Exclude<StageId, "title">;
  tag: string;
  title: string;
  body: string[];
  gearLabel: string;
  gear: string[];
  note?: string;
}

export interface QuestEntry {
  status: "progress" | "cleared" | "prologue";
  statusLabel: string;
  period: string;
  role: string;
  org: string;
  bullets: string[];
}

export interface RecordCopy {
  label: string;
  how: string;
}

export interface ItemCopy {
  desc: string;
  rarity: string;
}

export interface ContactCopy {
  label: string;
}

export interface Content {
  meta: { title: string; description: string };
  ui: {
    skip: string;
    nav: { log: string; records: string; items: string; contact: string };
    langButton: string;
    langLabel: string;
    stage: string;
    stageNames: Record<StageId, string>;
    goToStage: string;
  };
  sceneLabels: Record<StageId, string>;
  hero: HeroCopy;
  stages: StageCopy[];
  questLog: { title: string; subtitle: string; entries: QuestEntry[] };
  records: { title: string; subtitle: string; newRecord: string; items: RecordCopy[] };
  inventory: { title: string; subtitle: string; stars: string; more: string; moreDesc: string; items: ItemCopy[] };
  contact: { title: string; prompt: string; insertCoin: string; links: ContactCopy[]; footer: string };
}
