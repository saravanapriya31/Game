import React from "react";
import RapidFireGame from "./Components/RapidFireGame";
import PathfindingGame from "./Components/PathFindingGame";
import VisualMemory from "./Components/VisualMemory";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./ReusableComponents/Header";
// import Hls from "./Components/VedioPlayerComponents/Hls.jsx"
import VideoPlayer from "./Components/VedioPlayerComponents/Hls.jsx";

function App() {
  return (
    <BrowserRouter>
    <Header />
      <Routes>
        <Route path="/" element={<RapidFireGame />} />
        <Route path="/pathfinding" element={<PathfindingGame />} />
        <Route path="/memory" element={<VisualMemory />} />
        {/* <Route path="/video" element={<Hls />} /> */}
        {/* <Route
  path="/video"
  element={
    // <Hls
    //   PuzzleComponent={VisualMemory}
    <VideoPlayer
  PuzzleComponent={VisualMemory}
      puzzles={[
        {
          time: 20,
          // type: "memory",
        },
      ]}
    /> */}
      <Route
          path="/video"
          element={
            <VideoPlayer
              src="https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8"
              PuzzleComponent={VisualMemory}
              puzzles={[{ time: 20 }]}
            />
          }
        />

      </Routes>
    
    </BrowserRouter>
  );
}

export default App;