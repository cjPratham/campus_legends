import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Leaderboard from "./pages/Leaderboard";
import Admin from "./pages/Admin";
import Login from "./pages/Login";
import ProtectedRoute from "./components/ProtectedRoute";

export default function App() {
  return (
    
    <Router>
      <nav className="bg-gray-800 text-white p-4 flex gap-4 w-full">
        <Link to="/">🏆 Leaderboard</Link>
        <Link to="/admin">⚙️ Admin</Link>
      </nav>

      <Routes>
        {/* Public leaderboard */}
        <Route path="/" element={<Leaderboard />} />

        {/* Admin login */}
        <Route path="/login" element={<Login />} />

        {/* Protected admin dashboard */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <Admin />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}
