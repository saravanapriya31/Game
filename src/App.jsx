import React from "react";
import RapidFireGame from "./Components/RapidFireGame";
import PathfindingGame from "./Components/PathFindingGame";
import VisualMemory from "./Components/VisualMemory";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./Components/ReusableComponents/Header.jsx";
// import Hls from "./Components/VedioPlayerComponents/Hls.jsx"
import VideoPlayer from "./Components/VedioPlayerComponents/Hls.jsx";
import Login from "./Components/authpages/Login.jsx";
import { GoogleOAuthProvider } from "@react-oauth/google";
import "antd/dist/reset.css";
import Signup from "./Components/authpages/SignUp.jsx";
import SequencePuzzle from "./Components/Game/SequencePuzzle.jsx"
import Pattern from "./Components/Game/Pattern.jsx"

function App() {
  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
    <BrowserRouter>
    <Header />
      <Routes>
        <Route path="/" element={<RapidFireGame />} />
        <Route path="/pathfinding" element={<PathfindingGame />} />
        <Route path="/memory" element={<VisualMemory />} />
       <Route path="/login" element={<Login />} />
       <Route path="/signup" element={<Signup />} />
       <Route path="/sequence" element={<SequencePuzzle />} />
       <Route path="/pattern" element={<Pattern />} />
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
    </GoogleOAuthProvider>
  );
}

export default App;