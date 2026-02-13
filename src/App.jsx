import React from "react";
import RapidFireGame from "./Components/RapidFireGame";
import PathfindingGame from "./Components/PathFindingGame";
import VisualMemory from "./Components/VisualMemory";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./ReusableComponents/Header";
import Hls from "./Components/VedioPlayerComponents/Hls.jsx"

function App() {
  return (
    <BrowserRouter>
    <Header />
      <Routes>
        <Route path="/" element={<RapidFireGame />} />
        <Route path="/pathfinding" element={<PathfindingGame />} />
        <Route path="/memory" element={<VisualMemory />} />
        <Route path="/video" element={<Hls />} />
      </Routes>
    
    </BrowserRouter>
  );
}

export default App;