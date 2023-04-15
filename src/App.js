
import "./App.css";
import { Route, Routes } from "react-router-dom";
import XOGame from "./xoGame";
import Home from "./Home";
function App() {

  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="XOGame" element={<XOGame />} />
      </Routes>
    </div>
  );
}

export default App;