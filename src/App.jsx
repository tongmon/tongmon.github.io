import { HashRouter as Router, Routes, Route } from "react-router-dom";

import { GetBlogContentTree } from "./components/util/GetBlogContentTree";
import { Home } from "./components/home/Home";
import { Learn } from "./components/learn/Learn";
import { PostGridView } from "./components/learn/post_grid_view/PostGridView";

function App() {
  function LearnRoute() {
    let learnContentTree = GetBlogContentTree().children.find(
      (item) => item.label == "Learn"
    );

    function MakeLearnRoute(node, path) {
      if (node.isLeaf) {
        return (
          <Route
            key={path}
            path={path}
            element={<PostGridView content={node} />}
          />
        );
      }

      return node.children.map((child) => {
        let newPath = path + "/" + child.label;
        return (
          <Route
            key={newPath}
            path={newPath}
            element={<PostGridView node={child} />}
          >
            {MakeLearnRoute(child, newPath)}
          </Route>
        );
      });
    }
  }

  return (
    <Router>
      <Routes>
        <Route exact path="/" element={<Home />} />
        <Route path="/Learn" element={<Learn />}></Route>
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
