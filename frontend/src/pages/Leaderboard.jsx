import { useEffect, useState } from "react";
import axios from "axios";
import Podium from "../components/Podium";
import LeaderboardRow from "../components/LeaderboardRow";

export default function Leaderboard() {
  const [globalTop3, setGlobalTop3] = useState([]); 
  const [students, setStudents] = useState([]); 
  const [branches, setBranches] = useState([]);
  const [search, setSearch] = useState("");
  const [branch, setBranch] = useState("");

  // Fetch branches once
  const fetchBranches = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/leaderboard/branches");
      if (Array.isArray(res.data)) {
        setBranches(res.data);
      } else {
        setBranches([]);
      }
    } catch (err) {
      console.error("Failed to fetch branches", err);
    }
  };

  // Fetch full leaderboard once for top 3 & global ranks
  const fetchGlobalLeaderboard = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/leaderboard");
      const sorted = res.data.sort(
        (a, b) => b.totalPoint - a.totalPoint || b.rand - a.rand
      );
      const ranked = sorted.map((s, idx) => ({ ...s, rank: idx + 1 }));

      setGlobalTop3(ranked.slice(0, 3));
    } catch (err) {
      console.error("Failed to fetch leaderboard", err);
    }
  };

  // Fetch filtered list but keep global ranks
  const fetchFilteredStudents = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/leaderboard", {
        params: { search, branch },
      });

      // The backend should already send global ranks, so no re-ranking here
      const filtered = res.data.filter(
        (s) => !globalTop3.some((top) => top._id === s._id)
      );

      setStudents(filtered);
    } catch (err) {
      console.error("Failed to fetch students", err);
    }
  };

  useEffect(() => {
    fetchBranches();
    fetchGlobalLeaderboard();
  }, []);

  useEffect(() => {
    if (globalTop3.length) {
      fetchFilteredStudents();
    }
  }, [search, branch, globalTop3]);

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-purple-900 via-gray-900 to-black text-white px-4 sm:px-6 lg:px-8">
      <h1 className="text-4xl font-bold text-center mb-10 neon-text">
        🔥 Campus Legends
      </h1>

      {/* Search & Filter */}
      <div className="flex flex-wrap gap-4 justify-center mb-8">
        <input
          type="text"
          placeholder="Search by name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="p-2 rounded bg-gray-800 border border-gray-600"
        />
        <select
          value={branch}
          onChange={(e) => setBranch(e.target.value)}
          className="p-2 rounded bg-gray-800 border border-gray-600"
        >
          <option value="">All Branches</option>
          {branches.map((b, i) => (
            <option key={i} value={b}>
              {b}
            </option>
          ))}
        </select>
      </div>

      {/* Podium (global top 3) */}
      <Podium students={globalTop3} />

      {/* Rest of leaderboard */}
      <div className="mx-auto space-y-3 w-full max-w-5xl">
        {students.map((student) => (
          <LeaderboardRow
            key={student._id}
            student={student}
            rank={student.rank}
          />
        ))}
      </div>
    </div>
  );
}
