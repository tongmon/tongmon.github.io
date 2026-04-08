import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import App from "@/app/App";

// ref: https://dev.to/pixmy/animated-arcade-with-pure-css-5hn1
// ref: https://pixelcorners.lukeb.co.uk/?radius=8&multiplier=5
// ref: https://inpa.tistory.com/entry/CSS-%F0%9F%93%9A-%ED%94%8C%EB%9E%99%EC%8A%A4Flex-%F0%9F%92%AF-%EC%B4%9D%EC%A0%95%EB%A6%AC
// ref: https://velog.io/@cdw8431/2025%EB%85%84-%EC%9D%B4%EC%A7%81-%ED%9A%8C%EA%B3%A0-%EC%88%A8%EA%B3%A0-%EC%B5%9C%EC%A2%85%ED%95%A9%EA%B2%A9

// 1. searchbar를 headerbar로 이동시키기 -> o
// 2. grid / compact 기능 삭제 -> O
// 3. 각 tag가 눌리는 경우 활성화 -> O
// 4. home 연결되는 페이지 삭제 -> o
// 5. scroll restoration 적용 -> O
// 6. 1 min read 같은 reading time 가중치 based로 수정
// 7. 블로그 글이 많아지면 관리가 힘드니 index.md를 포함한 폴더를 말단으로 생각하는 기법 도입
// 8. related post는 2개 제한
// 9. 전체보기 태그 추가하고 사이드 바에 post / series / about 삭제 -> O
// 10. headerbar에 프로필 사진 이름 넣기 -> o
// 11. 블로그 카드에서 태그 누르면 해당 태그로 이동시키기
// 12. tags와 post list 컴포넌트 통합
// 13. blog image processing 로직 수정
// 14. 모바일 화면 구성

ReactDOM.createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
