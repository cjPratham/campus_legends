import { motion } from "framer-motion";

export default function Podium({ students }) {
  return (
    <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-4 sm:gap-6 mb-12 w-full">
  {students.map((s, i) => (
    <motion.div
      key={s._id}
      className={`flex-1 p-4 sm:p-6 rounded-2xl shadow-lg text-center min-w-[200px] ${
        i === 0 ? "bg-yellow-400 text-black scale-105" :
        i === 1 ? "bg-gray-300 text-black" : "bg-orange-400 text-black"
      }`}
      initial={{ y: -30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: i * 0.15 }}
    >
      <span className="text-lg sm:text-2xl font-bold">
        {i + 1} {i === 0 && "👑"}
      </span>
      <h2 className="mt-1 sm:mt-2 text-base sm:text-lg font-semibold break-words">
        {s.name}
      </h2>
      <p className="text-xs sm:text-sm">{s.branch}</p>
      <p className="text-lg sm:text-xl font-bold mt-2">{s.totalPoint} pts</p>
    </motion.div>
  ))}
</div>
  );
}
