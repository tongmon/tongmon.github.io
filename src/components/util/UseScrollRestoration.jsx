import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

const scrollPositions = {};

export function UseScrollRestoration() {
  const location = useLocation();
  const pathname = location.pathname + location.search + location.hash;

  useEffect(() => {
    const handleBeforeUnload = () => {
      scrollPositions[pathname] = window.scrollY;
    };

    // 페이지 이동 전 현재 위치 저장
    return () => {
      scrollPositions[pathname] = window.scrollY;
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [pathname]);

  useEffect(() => {
    // 이동 후 저장된 위치가 있으면 복원
    if (scrollPositions[pathname] !== undefined) {
      window.scrollTo(0, scrollPositions[pathname]);
    } else {
      window.scrollTo(0, 0); // 없으면 맨 위로
    }
  }, [pathname]);
}
