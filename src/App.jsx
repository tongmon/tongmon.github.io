import { HashRouter as Router, Routes, Route } from "react-router-dom";

import { GetBlogContentTree } from "./components/util/GetBlogContentTree";
import { Home } from "./components/home/Home";
import { Learn } from "./components/learn/Learn";

function App() {
  GetBlogContentTree();

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
