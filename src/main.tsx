import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import App from "@/app/App";

// ref: https://dev.to/pixmy/animated-arcade-with-pure-css-5hn1
// ref: https://pixelcorners.lukeb.co.uk/?radius=8&multiplier=5
// ref: https://inpa.tistory.com/entry/CSS-%F0%9F%93%9A-%ED%94%8C%EB%9E%99%EC%8A%A4Flex-%F0%9F%92%AF-%EC%B4%9D%EC%A0%95%EB%A6%AC
// ref: https://velog.io/@cdw8431/2025%EB%85%84-%EC%9D%B4%EC%A7%81-%ED%9A%8C%EA%B3%A0-%EC%88%A8%EA%B3%A0-%EC%B5%9C%EC%A2%85%ED%95%A9%EA%B2%A9

// 11. 블로그 카드에서 태그 누르면 해당 태그로 이동시키기
// 11. fallback cover 내부 ui 개선
// 1. tag page 레이아웃 개선점 생각하기 -> 애니메이션을 넣어서 개선 가능
// 1. giscus 사용해서 댓글 기능 구현
// 1. 카테고리 제거 고려
// 17. 다국어 지원도 가능한지 -> 선택

ReactDOM.createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
