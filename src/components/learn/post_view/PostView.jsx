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

  return (
    <>
      {!loading && (
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
      )}
    </>
  );
}
