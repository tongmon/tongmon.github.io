import { m } from "framer-motion";
import { useEffect, useRef } from "react";
import { useLocation, useNavigationType } from "react-router-dom";

import classes from "../learn/Learn.module.css";

// 스크롤 위치를 저장할 Map
const scrollPositions = new Map();

export function ScrollRestoration({ scrollInfo }) {
  const location = useLocation();
  const navType = useNavigationType(); // PUSH, POP, REPLACE
  const prevLocation = useRef(location);

  useEffect(() => {}, [scrollInfo]);

  // 변경 전 위치 scroll 저장
  //useEffect(() => {
  //  return () => {
  //    let scrollY = window.scrollY;
  //    if (scrollInfo.query.length > 0) {
  //      const scrollContainer = document.querySelector(
  //        scrollInfo.query /* `.${classes["learn-bg"]}` */
  //      );
  //      scrollY = scrollContainer?.scrollTop ?? 0;
  //    }
  //    scrollPositions.set(prevLocation.current.pathname, scrollY /* 100 */);
  //    console.log(
  //      "Scroll Info: ",
  //      scrollInfo,
  //      " Path: ",
  //      prevLocation.current.pathname,
  //      " Scroll y: ",
  //      scrollY
  //    );
  //  };
  //}, [location]);

  //// 변경 후 scroll 복원
  //useEffect(() => {
  //  if (!scrollInfo.isReady) return;

  //  const savedY = scrollPositions.get(location.pathname) ?? 0;
  //  const scrollContainer =
  //    scrollInfo.query.length > 0
  //      ? document.querySelector(scrollInfo.query)
  //      : window;
  //  console.log(
  //    "Scroll Pos: ",
  //    scrollPositions,
  //    " Saved Y: ",
  //    savedY,
  //    " Scroll Container: ",
  //    scrollContainer,
  //    " Path: ",
  //    location.pathname,
  //    " Nav Type: ",
  //    navType
  //  );

  //  if (navType === "POP") {
  //    // setTimeout(() => {
  //    //   scrollContainer.scrollTo(0, savedY);
  //    // }, 60);
  //    // scrollContainer.scrollTo(0, savedY); // 뒤로가기일 경우 복원
  //    requestAnimationFrame(() => {
  //      scrollContainer.scrollTo({
  //        top: savedY,
  //        behavior: "smooth",
  //      });
  //    });
  //  } else {
  //    scrollContainer.scrollTo(0, 0); // 새 페이지는 맨 위로
  //  }

  //  prevLocation.current = location;
  //}, [scrollInfo]);

  return null;
}

// export function ScrollRestoration({ scrollInfo }) {
//   const location = useLocation();
//   const navType = useNavigationType(); // PUSH, POP, REPLACE
//   const prevLocation = useRef(location);
//
//   // 변경 전 위치 scroll 저장
//   useEffect(() => {
//     return () => {
//       let scrollY = window.scrollY;
//       if (scrollInfo.query.length > 0) {
//         const scrollContainer = document.querySelector(scrollInfo.query);
//         scrollY = scrollContainer?.scrollTop ?? 0;
//       }
//       scrollPositions.set(prevLocation.current.pathname, scrollY);
//       console.log(
//         "Path: ",
//         prevLocation.current.pathname,
//         " Scroll y: ",
//         scrollY
//       );
//     };
//   }, [scrollInfo, location]);
//
//   // 변경 후 scroll 복원
//   useEffect(() => {
//     if (!scrollInfo.isReady) return;
//
//     const savedY = scrollPositions.get(location.pathname) ?? 0;
//     const scrollContainer =
//       scrollInfo.query.length > 0
//         ? document.querySelector(scrollInfo.query)
//         : window;
//     console.log(
//       "Scroll Pos: ",
//       scrollPositions,
//       " Saved Y: ",
//       savedY,
//       " Scroll Container: ",
//       scrollContainer,
//       " Path: ",
//       location.pathname,
//       " Nav Type: ",
//       navType
//     );
//
//     if (navType === "POP") {
//       setTimeout(() => {
//         scrollContainer.scrollTo(0, savedY);
//       }, 60);
//       // scrollContainer.scrollTo(0, savedY); // 뒤로가기일 경우 복원
//     } else {
//       scrollContainer.scrollTo(0, 0); // 새 페이지는 맨 위로
//     }
//
//     prevLocation.current = location;
//   }, [scrollInfo, location]);
//
//   return null;
// }

//const location = useLocation();
//const navigationType = useNavigationType(); // 'PUSH', 'POP', 'REPLACE'
//const prevPathRef = useRef(null);
//useEffect(() => {
//  console.log("Scroll Pos map: ", scrollPositions);
//  const prevPath = prevPathRef.current;
//  // 이전 경로의 스크롤 위치 저장
//  if (prevPath) {
//    console.log("Path: ", prevPath, " Scroll y: ", window.scrollY);
//    scrollPositions.set(prevPath, window.scrollY);
//  }
//  const storedY = scrollPositions.get(location.pathname);
//  if (navigationType === "POP" && typeof storedY === "number") {
//    // 뒤로 가기 또는 앞으로 가기 → 저장된 위치로 스크롤 복원
//    console.log("Saved page, scroll to ", storedY);
//    requestAnimationFrame(() => {
//      window.scrollTo({ top: storedY, behavior: "smooth" });
//    });
//  } else {
//    // 새 경로로 이동 → 스크롤 맨 위
//    console.log("New Page, scroll to top!");
//    requestAnimationFrame(() => {
//      window.scrollTo({ top: 0, behavior: "smooth" });
//    });
//  }
//  prevPathRef.current = location.pathname;
//}, [location.pathname, navigationType]);
//return null;
//const location = useLocation();
//useEffect(() => {
//  const hash = decodeURIComponent(location.hash.slice(1));
//  if (!hash) return;
//  // 약간의 딜레이를 줘야 DOM이 렌더링된 후 스크롤됨
//  const scrollToElement = () => {
//    const element = document.getElementById(hash);
//    if (element) {
//      window.scrollTo({
//        top: element.offsetTop,
//        behavior: "smooth",
//      });
//    }
//  };
//  // requestAnimationFrame으로 DOM 렌더 완료 후 실행
//  requestAnimationFrame(scrollToElement);
//}, [location]);
//return null;
