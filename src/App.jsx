import React from "react";
import RapidFireGame from "./Components/RapidFireGame";
import PathfindingGame from "./Components/PathFindingGame";
import VisualMemory from "./Components/VisualMemory";
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<RapidFireGame />} />
        <Route path="/pathfinding" element={<PathfindingGame />} />
        <Route path="/memory" element={<VisualMemory />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;