import type { Content } from "./types";

export const en: Content = {
  meta: {
    title: "tongstar — DevOps engineer, indie game dev, quant",
    description:
      "tongstar (Kyungjoon Lee) builds infotainment test pipelines at General Motors by day, and makes pixel-art games and researches trading strategies by night.",
  },
  ui: {
    skip: "Skip to quest log",
    nav: { log: "LOG", records: "RECORDS", items: "ITEMS", contact: "CONTACT" },
    langButton: "한국어",
    langLabel: "한국어로 보기",
    stage: "STAGE",
    stageNames: { title: "TITLE", devops: "DAY JOB", gamedev: "GAME DEV", quant: "QUANT" },
    goToStage: "Go to",
  },
  sceneLabels: {
    title:
      "Pixel-art bedroom at night. tongstar sits at a wooden desk with headphones around the neck; the monitor shows a blinking command prompt.",
    devops:
      "The same desk by day. The monitor runs a test pipeline that turns green step by step, while a small robot taps an infotainment test bench and a server rack blinks.",
    gamedev:
      "The desk at sunset. A sprite editor on the monitor paints a little knight pixel by pixel, next to a game controller, cartridges and an arcade cabinet.",
    quant:
      "The desk late at night. A candlestick chart grows on the monitor, a gold coin spins on the desk and a locked safe sits on the floor.",
  },
  hero: {
    eyebrow: "PLAYER 1",
    taglineTop: "DevOps engineer by day.",
    taglineBottom: "Indie game dev & quant by night.",
    speaker: "TONGSTAR",
    greeting:
      "Hi, I'm tongstar (Kyungjoon Lee). I build the test pipelines behind in-car infotainment at General Motors, and spend my evenings on pixels and price charts.",
    hint: "SCROLL TO START",
  },
  stages: [
    {
      id: "devops",
      tag: "STAGE 1 · MAIN QUEST",
      title: "By day, I build the pipelines that test car infotainment.",
      body: [
        "At General Motors I build and run the test pipelines for our infotainment systems. Robot Framework drives Appium tests against Android emulators inside Docker, or against real test-vehicle benches, on schedules in Jenkins and GitHub Actions.",
      ],
      gearLabel: "EQUIPPED",
      gear: ["Jenkins", "GitHub Actions", "Docker", "Robot Framework", "Appium", "Python", "Kotlin"],
    },
    {
      id: "gamedev",
      tag: "STAGE 2 · SIDE QUEST",
      title: "After hours, I'm making a pixel-art indie game.",
      body: [
        "Games are why I picked up C and C++ in my first year of university. Now I'm building a new pixel indie game, and test-driving engines like Bevy, Godot and LÖVE along the way.",
      ],
      gearLabel: "TOOLKIT",
      gear: ["Pixel art", "C++", "C#", "Bevy", "Godot", "LÖVE"],
      note: "STATUS: IN DEVELOPMENT",
    },
    {
      id: "quant",
      tag: "STAGE 3 · SIDE QUEST",
      title: "Late at night, I hunt for trading strategies.",
      body: [
        "I research systematic strategies for Bitcoin and the S&P 500 in Python, and I'm building my own research pipeline to take ideas from raw data to tested results faster.",
        "How does that pipeline work? That part is classified.",
      ],
      gearLabel: "EQUIPPED",
      gear: ["Python", "BTC", "S&P 500", "Backtesting", "Research pipeline"],
      note: "CLASSIFIED",
    },
  ],
  questLog: {
    title: "QUEST LOG",
    subtitle: "The story so far.",
    entries: [
      {
        status: "progress",
        statusLabel: "IN PROGRESS",
        period: "Jul 2024 — Now",
        role: "Software Developer",
        org: "General Motors",
        bullets: [
          "Build infotainment test pipelines with Jenkins, GitHub Actions, Docker, and Robot Framework + Appium.",
          "Run suites on Dockerized Android emulators and on real test-vehicle benches, on a schedule.",
          "Develop Android car property control tooling in Kotlin.",
          "Built test modules for the NUGU voice assistant.",
        ],
      },
      {
        status: "cleared",
        statusLabel: "CLEARED",
        period: "Sep 2021 — Jul 2024",
        role: "Researcher",
        org: "HandySoft",
        bullets: [
          "Migrated the groupware client from C++11 to C++20, opening it up to far more libraries.",
          "Brought WebView2 into the client so customers could keep using it after Internet Explorer's retirement, and renew their contracts.",
          "Introduced a package manager to make the client easier to extend.",
          "Fixed unreleased heap memory and unchecked return values to pass CSAP security certification.",
          "Wrote a regex + wxWidgets tool that automated converting MultiByte projects to Unicode.",
        ],
      },
      {
        status: "cleared",
        statusLabel: "CLEARED",
        period: "Feb 2016 — Feb 2022",
        role: "B.S. Computer Science",
        org: "Anyang University",
        bullets: [
          "GPA 4.38 / 4.5. Graduated summa cum laude, top of my department.",
          "Clubs: Unicom (computer science), Takuyaki (table tennis).",
        ],
      },
      {
        status: "prologue",
        statusLabel: "PROLOGUE",
        period: "Freshman year",
        role: "It started with games.",
        org: "",
        bullets: [
          "I learned C and C++ because I wanted to make games. Then I found the real hook: the rush of watching slow code run fast.",
          "I still study whatever I can, and commit it to GitHub.",
        ],
      },
    ],
  },
  records: {
    title: "SPEEDRUN RECORDS",
    subtitle: "Personal bests from optimizing production software at HandySoft.",
    newRecord: "NEW RECORD!",
    items: [
      { label: "MSVC BUILD", how: "Parallel builds" },
      { label: "XML PARSE", how: "Huge distribution document" },
      { label: "CSV → LIST VIEW", how: "Multithreaded loading" },
    ],
  },
  inventory: {
    title: "INVENTORY",
    subtitle: "Things I've built. Select an item to inspect it on GitHub.",
    stars: "stars",
    more: "MORE ON GITHUB",
    moreDesc: "Every repo, practice projects included.",
    items: [
      { desc: "Frameless window template for Windows, built with Qt and QML.", rarity: "LEGENDARY" },
      { desc: "Lightweight desktop messenger, server and client, in C++ and Qt.", rarity: "EPIC" },
      { desc: "Chrome extension that calculates product margins.", rarity: "RARE" },
      { desc: "Practice with OpenGL, DirectX, Vulkan and game engine basics.", rarity: "RARE" },
      { desc: "A tour of desktop UI frameworks: Qt, GTK, MFC, WPF and more.", rarity: "UNCOMMON" },
      { desc: "Data structures and algorithms practice.", rarity: "UNCOMMON" },
    ],
  },
  contact: {
    title: "CONTINUE?",
    prompt: "Want to talk pipelines, pixels or markets? Pick an option.",
    insertCoin: "INSERT COIN",
    credit: "CREDIT",
    links: [{ label: "EMAIL" }, { label: "GITHUB" }, { label: "LINKEDIN" }, { label: "INSTAGRAM" }],
    gameOver: "GAME OVER",
    thanks: "THANKS FOR PLAYING!",
    credits: [
      ["DIRECTOR", "tongstar"],
      ["CODE", "Claude Code"],
      ["PIXEL ART", "Codex · ENDESGA 32"],
      ["FONT", "Galmuri by quiple"],
      ["SPECIAL THANKS", "YOU!"],
    ],
    continueGame: "CONTINUE",
    newGame: "NEW GAME",
    footer: "© 2026 tongstar · Built pixel by pixel.",
  },
};
