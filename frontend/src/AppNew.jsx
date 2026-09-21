```jsx
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Features from "./pages/Features";
import About from "./pages/About";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import PlacementPrediction from "./pages/PlacementPrediction";
import PlacementResult from "./pages/PlacementResult";
import CareerRecommendation from "./pages/CareerRecommendation";
import CareerRecommendationResult from "./pages/CareerRecommendationResult";
import SkillGap from "./pages/SkillGap";
import CareerRoadmap from "./pages/CareerRoadmap";
import Profile from "./pages/Profile";

function AppNew() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/features" element={<Features />} />
        <Route path="/about" element={<About />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />

        <Route path="/placement" element={<PlacementPrediction />} />
        <Route path="/placement-result" element={<PlacementResult />} />

        <Route
          path="/career-recommendation"
          element={<CareerRecommendation />}
        />

        <Route
          path="/career-recommendation-result"
          element={<CareerRecommendationResult />}
        />

        <Route path="/skill-gap" element={<SkillGap />} />
        <Route path="/career-roadmap" element={<CareerRoadmap />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppNew;
```
