import { m } from "framer-motion";
import { useEffect, useRef } from "react";
import { useLocation, useNavigationType } from "react-router-dom";

// 스크롤 위치를 저장할 Map
const scrollCaches = new Map();

export function ScrollRestoration({ scrollDivQuery }) {
  const location = useLocation();
  const navType = useNavigationType(); // PUSH, POP, REPLACE
  const scrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      scrollY.current =
        scrollDivQuery.current.length > 0
          ? document.querySelector(scrollDivQuery.current).scrollTop
          : window.scrollY;
    };

    window.addEventListener("scroll", handleScroll, {
      passive: true,
      capture: true,
    });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // useEffect is executed right before location start to change
  useEffect(() => {
    return () => {
      scrollCaches.set(location.pathname, {
        scrollY: scrollY.current,
        query: scrollDivQuery.current,
      });
      console.log("scrollCaches: ", scrollCaches);
    };
  }, [location]);

  useEffect(() => {
    const scrollCache = scrollCaches.get(location.pathname) ?? {
      scrollY: 0,
      query: "",
    };
    const scrollContainer =
      scrollCache.query.length > 0
        ? document.querySelector(scrollCache.query)
        : window;
    requestAnimationFrame(() => {
      scrollY.current = navType === "POP" ? scrollCache.scrollY : 0;
      scrollContainer.scrollTo({
        top: scrollY.current,
        ...(navType === "REPLACE" ? { behavior: "smooth" } : {}),
      });
    });
    //if (navType === "POP") {
    //  requestAnimationFrame(() => {
    //    scrollContainer.scrollTo({
    //      top: scrollCache.scrollY,
    //      behavior: "smooth",
    //    });
    //  });
    //} else if (navType === "REPLACE") {
    //  console.log("Replaced Page!");
    //  requestAnimationFrame(() => {
    //    scrollContainer.scrollTo({
    //      top: 0,
    //      behavior: "smooth",
    //    });
    //  });
    //} else {
    //  console.log("New Page!");
    //  requestAnimationFrame(() => {
    //    scrollContainer.scrollTo({
    //      top: 0,
    //      behavior: "smooth",
    //    });
    //  });
    //  // scrollContainer.scrollTo(0, 0); // Move newpage to the top
    //}
  }, [location]);

  return null;
}
