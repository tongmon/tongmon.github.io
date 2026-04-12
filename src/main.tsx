import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import App from "@/app/App";

// ref: https://dev.to/pixmy/animated-arcade-with-pure-css-5hn1
// ref: https://pixelcorners.lukeb.co.uk/?radius=8&multiplier=5
// ref: https://inpa.tistory.com/entry/CSS-%F0%9F%93%9A-%ED%94%8C%EB%9E%99%EC%8A%A4Flex-%F0%9F%92%AF-%EC%B4%9D%EC%A0%95%EB%A6%AC
// ref: https://velog.io/@cdw8431/2025%EB%85%84-%EC%9D%B4%EC%A7%81-%ED%9A%8C%EA%B3%A0-%EC%88%A8%EA%B3%A0-%EC%B5%9C%EC%A2%85%ED%95%A9%EA%B2%A9

// 11. 블로그 카드에서 태그 누르면 해당 태그로 이동시키기
// 13. blog image processing 로직 수정
// 1. giscus 사용해서 댓글 기능 구현
// 17. 다국어 지원도 가능한지 -> 선택

// 1. cover 이미지가 제공이 된다면 해당 이미지를 PostCard에 사용
// 2. cover 이미지는 없지만 블로그 내부 글에 이미지가 존재한다면 해당 이미지를 PostCard에 사용
// 3. cover 이미지도 없고 블로그 글 내부 이미지도 없다면 글자만 있다는 정보를 주는 이미지를 대신 삽입

ReactDOM.createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
