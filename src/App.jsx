import { useState, useRef } from "react";
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import { Home } from "./components/home/Home";
import { Learn } from "./components/learn/Learn";
import { LearnPostViewRenderer } from "./components/learn/learn_post_view_renderer/LearnPostViewRenderer";
import { PostDataManager } from "./components/util/PostDataManager";
import { ScrollRestoration } from "./components/util/ScrollRestoration";

function App() {
  const postDataManager = new PostDataManager();
  const scrollDivQuery = useRef("");

  return (
    <Router>
      <ScrollRestoration scrollDivQuery={scrollDivQuery} />
      <Routes>
        <Route exact path="/" element={<Home />} />
        <Route
          path={`/${postDataManager.getPostTree().rootPrefix}/*`}
          element={<Learn />}
        >
          <Route
            path="*"
            element={<LearnPostViewRenderer scrollDivQuery={scrollDivQuery} />}
          />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
