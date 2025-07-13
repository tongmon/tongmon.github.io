import { useEffect, useRef } from "react";
import { useLocation, unstable_useBlocker } from "react-router-dom";

const scrollPositions = new Map();

export function useScrollRestoration() {
  const location = useLocation();

  useEffect(() => {
    const handleBeforeUnload = () => {
      scrollPositions.set(location.key || location.pathname, window.scrollY);
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      scrollPositions.set(location.key || location.pathname, window.scrollY);
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [location]);

  useEffect(() => {
    const y = scrollPositions.get(location.key || location.pathname) || 0;
    window.scrollTo(0, y);
  }, [location]);
}

// const scrollPositions = {};
//
// export function UseScrollRestoration() {
//   const location = useLocation();
//   const pathname = location.pathname + location.search + location.hash;
//
//   useEffect(() => {
//     const handleBeforeUnload = () => {
//       scrollPositions[pathname] = window.scrollY;
//     };
//
//     // 페이지 이동 전 현재 위치 저장
//     return () => {
//       scrollPositions[pathname] = window.scrollY;
//       window.removeEventListener("beforeunload", handleBeforeUnload);
//     };
//   }, [pathname]);
//
//   useEffect(() => {
//     // 이동 후 저장된 위치가 있으면 복원
//     if (scrollPositions[pathname] !== undefined) {
//       window.scrollTo(0, scrollPositions[pathname]);
//     } else {
//       window.scrollTo(0, 0); // 없으면 맨 위로
//     }
//   }, [pathname]);
// }
