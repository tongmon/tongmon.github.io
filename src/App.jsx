import { HashRouter as Router, Routes, Route } from "react-router-dom";

import { GetBlogContentTree } from "./components/util/GetBlogContentTree";
import { Home } from "./components/home/Home";
import { Learn } from "./components/learn/Learn";
import { PostGridView } from "./components/learn/post_grid_view/PostGridView";
import { PostView } from "./components/learn/post_view/PostView";

function App() {
  function LearnRoute() {
    let learnContentTree = GetBlogContentTree().children.find(
      (item) => item.label == "Learn"
    );

    function MakeLearnRoute(node) {
      if (node.isLeaf) {
        return (
          <Route
            key={node.label}
            path={node.label}
            element={<PostView node={node} />}
          />
        );
      }

      return (
        <Route
          key={node.label}
          path={node.label}
          element={<PostGridView node={node} />}
        >
          {node.children.map((child) => MakeLearnRoute(child))}
        </Route>
      );
    }

    return (
      <Route key="Learn" path="/Learn" element={<Learn />}>
        <Route
          key="All"
          path="All"
          element={<PostGridView node={learnContentTree} />}
        />
        {learnContentTree.children.map((child) => MakeLearnRoute(child))}
      </Route>
    );
  }

  return (
    <Router>
      <Routes>
        <Route exact path="/" element={<Home />} />
        {LearnRoute()}
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
