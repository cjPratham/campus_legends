import { motion } from "framer-motion";

export default function LeaderboardRow({ student, rank, rankChange, pointsChange }) {
  const getBadge = (rank) => {
    if (rank === 1) return "👑";
    if (rank === 2) return "🥈";
    if (rank === 3) return "🥉";
    if (rank <= 5) return "🔥";
    if (rank <= 10) return "🚀";
    if (rank <= 20) return "💯";
    if (rank <= 30) return "⚡";
    return "🎯";
  };

  const getChangeIcon = (change) => {
    if (change > 0) return <span className="text-green-500">⬆</span>;
    if (change < 0) return <span className="text-red-500">⬇</span>;
    // return <span className="text-gray-500">–</span>;
  };

  const getPointsChangeText = (change) => {
  if (!change) return null; // don't show (0)
  return (
    <span className="text-green-600">
      (+{change.toLocaleString()})
    </span>
  );
};

  return (
    <motion.div
      className="flex items-center justify-between p-4 bg-gray-800 rounded-lg hover:scale-[1.02] hover:shadow-lg transition-transform text-sm sm:text-base"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: rank * 0.03 }}
    >
      {/* Rank & Badge */}
      <div className="flex items-center gap-2 w-24">
        <span className="text-lg font-extrabold text-yellow-400">#{rank}</span>
        <span>{getBadge(rank)}</span>
        {getChangeIcon(rankChange)}
      </div>

      {/* Name & Branch */}
      <div className="flex flex-col flex-1 min-w-0 px-2">
        <span className="font-semibold truncate">{student.name}</span>
        <span className="text-gray-400 text-xs truncate">{student.branch}</span>
      </div>

      {/* Points & Points Change */}
      <div className="text-right min-w-[90px]">
        <span className="font-bold text-pink-400 text-lg">
          {student.totalPoint.toLocaleString()}
        </span>{" "}
        {getPointsChangeText(pointsChange)}
        <span className="block text-gray-500 text-xs">pts</span>
      </div>
    </motion.div>
  );
}
