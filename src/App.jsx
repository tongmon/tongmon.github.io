import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import { Home } from "./components/home/Home";
import { Learn } from "./components/learn/Learn";

function App() {
  return (
    <Router basename="/tongstar-blog/">
      <Routes>
        <Route exact path="/" element={<Home />} />
        <Route path="/learn" element={<Learn />} />
      </Routes>
    </Router>
  );
}

export default App;
