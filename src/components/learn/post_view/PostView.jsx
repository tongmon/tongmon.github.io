import { useEffect, useState, useCallback, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import classes from "./PostView.module.css";

export function PostView({ node }) {
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState("");
  const prevLocation = useRef("");

  const loadContent = async () => {
    setLoading(true);
    for (const child of node.children) {
      if (child.label.includes("content")) {
        console.log(child);
        const md = await child.module().then((m) => m.default);
        setContent(md);
        break;
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    if (prevLocation.current !== location.pathname) loadContent();
    prevLocation.current = location.pathname;
  }, [location.pathname]);

  //   const content = `
  // # Hello GFM
  //
  // - [x] 할 일 1
  // - [ ] 할 일 2
  //
  // ~~취소된 내용~~
  //
  // | 이름 | 나이 |
  // |------|------|
  // | 철수 | 14  |
  // | 영희 | 13  |
  //
  // www.example.com
  // `;

  return (
    <>
      {!loading && (
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
      )}
    </>
  );
}

// <div>Test</div>;

/*
ISOPLOT BOB WOW 구분하는 건가?

Project tree

Stategy diagram -> family, 카투카

Component search

ISOPLOT

Problem Def Tree / Project Tree
*/
