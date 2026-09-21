import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Features from "./pages/Features";
import About from "./pages/About";
import Login from "./pages/Login";
import Register from "./pages/Register";

import Dashboard from "./pages/Dashboard";

import Placement from "./pages/Placement";
import PlacementPrediction from "./pages/PlacementPrediction";
import PlacementResult from "./pages/PlacementResult";

import CareerRecommendation from "./pages/CareerRecommendation";
import CareerRecommendationResult from "./pages/CareerRecommendationResult";

import SkillGap from "./pages/SkillGap";
import CareerRoadmap from "./pages/CareerRoadmap";

import Profile from "./pages/Profile";

import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* PUBLIC PAGES */}
        <Route path="/" element={<Home />} />
        <Route path="/features" element={<Features />} />
        <Route path="/about" element={<About />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* DASHBOARD */}
        <Route path="/dashboard" element={<Dashboard />} />

        {/* PLACEMENT */}
        <Route path="/placement" element={<Placement />} />
        <Route
          path="/placement-prediction"
          element={<PlacementPrediction />}
        />
        <Route
          path="/placement-result"
          element={<PlacementResult />}
        />

        {/* CAREER RECOMMENDATION */}
        <Route
          path="/career-recommendation"
          element={<CareerRecommendation />}
        />
        <Route
          path="/career-recommendation-result"
          element={<CareerRecommendationResult />}
        />

        {/* SKILL GAP */}
        <Route
          path="/skill-gap"
          element={<SkillGap />}
        />

        <Route
          path="/career-roadmap"
          element={<CareerRoadmap />}
        />

        {/* PROFILE */}
        <Route
          path="/profile"
          element={<Profile />}
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;