import { useState, useRef } from "react";
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import { Home } from "./components/home/Home";
import { Learn } from "./components/learn/Learn";
import { LearnPostViewRenderer } from "./components/learn/learn_post_view_renderer/LearnPostViewRenderer";

import { ScrollRestoration } from "./components/util/ScrollRestoration";

function App() {
  const [scrollInfo, setScrollInfo] = useState({ query: "", isReady: false });

  return (
    <Router>
      <ScrollRestoration scrollInfo={scrollInfo} />
      <Routes>
        <Route exact path="/" element={<Home />} />
        <Route path="/Learn/*" element={<Learn />}>
          <Route
            path="*"
            element={<LearnPostViewRenderer setScrollInfo={setScrollInfo} />}
          />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;

/*
<Route path="/Learn" element={<Learn />}>
    <Route path="/All" element={<PostGrid />}>
    </Route>
    <Route path="/GameProgramming" element={<PostGrid />}>
        <Route path="/SDL" element={<PostGrid />}>
            <Route path="/01 Pong Game" element={<PostContent />}>
            </Route>
        </Route>
    </Route>
</Route>
*/
