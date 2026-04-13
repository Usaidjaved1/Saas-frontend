import { BrowserRouter, Routes, Route } from "react-router-dom";

import Landing from "./pages/Landing";
import Signup from "./pages/signup";
import Login from "./pages/Login";
import ProtectedDashboard from "./pages/ProtectedDashboard";
import PublicProfile from "./pages/PublicProfile"; // ✅ ADD THIS

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<ProtectedDashboard />} />

        {/* ⭐ PUBLIC PROFILE ROUTE */}
        <Route path="/u/:username" element={<PublicProfile />} />
      </Routes>
    </BrowserRouter>
  );
}