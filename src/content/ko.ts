import type { Content } from "./types";

export const ko: Content = {
  meta: {
    title: "tongstar — DevOps 엔지니어, 인디 게임 개발자, 퀀트",
    description:
      "낮에는 제너럴 모터스에서 인포테인먼트 테스트 파이프라인을 만들고, 밤에는 픽셀 게임을 만들며 트레이딩 전략을 연구하는 tongstar(이경준)의 페이지입니다.",
  },
  ui: {
    skip: "퀘스트 로그로 건너뛰기",
    nav: { log: "로그", records: "기록", items: "아이템", contact: "연락" },
    langButton: "ENGLISH",
    langLabel: "Switch to English",
    score: "SCORE",
    stage: "STAGE",
    stageNames: { title: "타이틀", devops: "본업", gamedev: "게임 개발", quant: "퀀트" },
    goToStage: "이동:",
  },
  sceneLabels: {
    title:
      "밤의 픽셀아트 방. 헤드폰을 목에 건 tongstar가 나무 책상 앞에 앉아 있고, 모니터에는 커서가 깜빡이는 명령 프롬프트가 떠 있습니다.",
    devops:
      "낮의 같은 책상. 모니터에서는 테스트 파이프라인이 한 단계씩 초록불로 바뀌고, 작은 로봇이 인포테인먼트 테스트 벤치 화면을 누르며, 서버랙이 깜빡입니다.",
    gamedev:
      "노을 진 책상. 모니터의 스프라이트 에디터가 작은 기사를 한 픽셀씩 그리고, 옆에는 게임패드와 카트리지, 오락기가 있습니다.",
    quant:
      "깊은 밤의 책상. 모니터에서는 캔들 차트가 자라나고, 책상 위에서는 금화가 돌고, 바닥에는 잠긴 금고가 놓여 있습니다.",
  },
  hero: {
    eyebrow: "PLAYER 1",
    taglineTop: "낮에는 DevOps 엔지니어,",
    taglineBottom: "밤에는 인디 게임 개발자이자 퀀트.",
    speaker: "TONGSTAR",
    greeting:
      "안녕하세요, tongstar(이경준)입니다. 제너럴 모터스에서 차량 인포테인먼트의 테스트 파이프라인을 만들고, 저녁에는 픽셀과 차트를 붙잡고 있어요.",
    hint: "스크롤해서 시작",
  },
  stages: [
    {
      id: "devops",
      tag: "STAGE 1 · 메인 퀘스트",
      title: "낮에는 차량 인포테인먼트를 테스트하는 파이프라인을 만듭니다.",
      body: [
        "제너럴 모터스에서 인포테인먼트 시스템의 테스트 파이프라인을 구축하고 운영합니다. Robot Framework 기반의 Appium 테스트를 Docker 안의 안드로이드 에뮬레이터나 실제 테스트 차량 벤치에서 돌리고, Jenkins와 GitHub Actions로 정기 실행합니다.",
      ],
      gearLabel: "장착 중",
      gear: ["Jenkins", "GitHub Actions", "Docker", "Robot Framework", "Appium", "Python", "Kotlin"],
    },
    {
      id: "gamedev",
      tag: "STAGE 2 · 사이드 퀘스트",
      title: "퇴근 후에는 픽셀 인디 게임을 만듭니다.",
      body: [
        "대학교 1학년 때 C와 C++을 공부하기 시작한 이유가 바로 게임이었어요. 지금은 새로운 픽셀 인디 게임을 개발하면서 Bevy, Godot, LÖVE 같은 엔진들을 직접 써 보고 있습니다.",
      ],
      gearLabel: "도구함",
      gear: ["픽셀 아트", "C++", "C#", "Bevy", "Godot", "LÖVE"],
      note: "STATUS: 개발 중",
    },
    {
      id: "quant",
      tag: "STAGE 3 · 사이드 퀘스트",
      title: "깊은 밤에는 트레이딩 전략을 찾아다닙니다.",
      body: [
        "Python으로 비트코인과 S&P 500 중심의 시스템 트레이딩 전략을 연구하고, 데이터에서 검증된 결과까지 더 빠르게 가기 위한 연구 파이프라인을 직접 만들고 있어요.",
        "그 파이프라인이 어떻게 생겼냐고요? 그건 일급 기밀입니다.",
      ],
      gearLabel: "장착 중",
      gear: ["Python", "BTC", "S&P 500", "백테스팅", "연구 파이프라인"],
      note: "CLASSIFIED",
    },
  ],
  questLog: {
    title: "퀘스트 로그",
    subtitle: "지금까지의 이야기.",
    entries: [
      {
        status: "progress",
        statusLabel: "진행 중",
        period: "2024.07 — 현재",
        role: "소프트웨어 개발자",
        org: "제너럴 모터스",
        bullets: [
          "Jenkins, GitHub Actions, Docker, Robot Framework + Appium으로 인포테인먼트 테스트 파이프라인 구축",
          "Docker 기반 안드로이드 에뮬레이터와 실제 테스트 차량 벤치에서 테스트를 정기 실행",
          "Kotlin으로 안드로이드 Car Property 제어 도구 개발",
          "NUGU 음성 비서 테스트 모듈 개발",
        ],
      },
      {
        status: "cleared",
        statusLabel: "클리어",
        period: "2021.09 — 2024.07",
        role: "연구원",
        org: "핸디소프트",
        bullets: [
          "그룹웨어 클라이언트를 C++11에서 C++20으로 마이그레이션해 활용 가능한 라이브러리를 크게 확장",
          "WebView2를 이식해 IE 지원 종료 후에도 고객이 제품을 계속 쓰고 재계약할 수 있도록 함",
          "패키지 매니저를 도입해 클라이언트의 기능 확장성 개선",
          "CSAP 인증 통과를 위해 힙 메모리 미해제, 반환값 미처리 등 보안 취약 코드 점검 및 수정",
          "정규식과 wxWidgets로 MultiByte 프로젝트를 Unicode로 전환하는 자동화 도구 제작",
        ],
      },
      {
        status: "cleared",
        statusLabel: "클리어",
        period: "2016.02 — 2022.02",
        role: "컴퓨터공학 학사",
        org: "안양대학교",
        bullets: [
          "학점 4.38 / 4.5, 학과 수석 및 최우등(summa cum laude) 졸업",
          "동아리: Unicom(컴퓨터공학), Takuyaki(탁구)",
        ],
      },
      {
        status: "prologue",
        statusLabel: "프롤로그",
        period: "대학교 1학년",
        role: "모든 건 게임에서 시작됐어요.",
        org: "",
        bullets: [
          "게임을 만들고 싶어서 C와 C++을 공부하기 시작했고, 느린 코드를 빠르게 만들 때의 쾌감에 빠져 지금까지 왔습니다.",
          "지금도 배울 수 있는 건 최대한 배우고, 그 기록을 GitHub에 커밋하고 있어요.",
        ],
      },
    ],
  },
  records: {
    title: "스피드런 기록",
    subtitle: "핸디소프트에서 실제 제품을 최적화하며 세운 개인 최고 기록.",
    newRecord: "신기록!",
    items: [
      { label: "MSVC 빌드", how: "병렬 빌드 도입" },
      { label: "XML 파싱", how: "대용량 배포 문서" },
      { label: "CSV → 목록 표시", how: "멀티스레딩" },
    ],
  },
  inventory: {
    title: "인벤토리",
    subtitle: "지금까지 만든 것들. 아이템을 선택하면 GitHub에서 볼 수 있어요.",
    stars: "스타",
    more: "GITHUB에서 더 보기",
    moreDesc: "연습용 프로젝트까지 모든 저장소.",
    items: [
      { desc: "Qt와 QML로 만든 Windows용 프레임리스 윈도우 템플릿.", rarity: "전설" },
      { desc: "C++과 Qt로 만든 가벼운 데스크톱 메신저. 서버와 클라이언트 모두.", rarity: "영웅" },
      { desc: "상품 마진을 계산해 주는 크롬 확장 프로그램.", rarity: "희귀" },
      { desc: "OpenGL, DirectX, Vulkan과 게임 엔진 기초 연습.", rarity: "희귀" },
      { desc: "Qt, GTK, MFC, WPF 등 데스크톱 UI 프레임워크 탐방.", rarity: "고급" },
      { desc: "자료구조와 알고리즘 연습.", rarity: "고급" },
    ],
  },
  contact: {
    title: "CONTINUE?",
    prompt: "파이프라인, 픽셀, 혹은 시장 이야기를 나누고 싶다면 하나를 골라 주세요.",
    insertCoin: "INSERT COIN",
    links: [{ label: "이메일" }, { label: "GITHUB" }, { label: "LINKEDIN" }, { label: "INSTAGRAM" }],
    footer: "© 2026 tongstar · 한 픽셀씩 쌓아 만들었습니다.",
  },
};
