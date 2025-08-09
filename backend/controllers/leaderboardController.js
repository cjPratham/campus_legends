const Student = require("../models/Student");
const Papa = require("papaparse");
const fs = require("fs");

exports.uploadCSV = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "CSV file is required" });

    const filePath = req.file.path;
    const fileContent = fs.readFileSync(filePath, "utf8");

    // Fetch old leaderboard BEFORE replacing
    const oldData = await Student.find().sort({ totalPoint: -1, rand: 1 }).lean();
    const oldRankMap = {};
    const oldPointsMap = {};

    oldData.forEach((student, index) => {
      const key = student.studentId?.toString().trim();
      if (key) {
        oldRankMap[key] = index + 1;
        oldPointsMap[key] = student.totalPoint;
      }
    });

    Papa.parse(fileContent, {
      header: true,
      skipEmptyLines: true,
      complete: async (results) => {
        try {
          const cleanedData = results.data
            .map((row) => ({
              studentId: row["ID"]?.toString().trim(),
              name: row["Name"]?.toString().trim(),
              branch: row["Branch"]?.toString().trim(),
              totalPoint: Number(
                row["TotalPoints"]?.toString().replace(/,/g, "") || 0
              ),
              rand: Math.floor(Math.random() * 1000),
            }))
            .filter(
              (s) =>
                s.studentId &&
                s.name &&
                s.branch &&
                !isNaN(s.totalPoint) &&
                !isNaN(s.rand)
            );

          // Sort by points + tie-breaker
          cleanedData.sort((a, b) => b.totalPoint - a.totalPoint || a.rand - b.rand);

          // Compute rank & point changes
          const finalData = cleanedData.map((stu, idx) => {
            const key = stu.studentId;
            const newRank = idx + 1;

            const hasOld = Object.prototype.hasOwnProperty.call(oldPointsMap, key);
            const oldRank = hasOld ? oldRankMap[key] : null;
            const oldPoints = hasOld ? oldPointsMap[key] : null;

            let rankChange = 0;
            if (oldRank != null) {
              if (newRank < oldRank) rankChange = 1;
              else if (newRank > oldRank) rankChange = -1;
            }

            const pointsChange = hasOld
              ? Math.max(0, stu.totalPoint - oldPoints)
              : 0;

            return {
              ...stu,
              rank: newRank,
              rankChange,
              pointsChange,
              oldPoints: hasOld ? oldPoints : null,
            };
          });

          // Replace DB
          await Student.deleteMany({});
          if (finalData.length > 0) await Student.insertMany(finalData);

          fs.unlinkSync(filePath);
          return res.json({
            message: `${finalData.length} students added successfully (old data replaced)`,
          });
        } catch (err) {
          console.error(err);
          return res.status(500).json({ message: "Error processing CSV data" });
        }
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};


exports.getLeaderboard = async (req, res) => {
  try {
    const { search, branch } = req.query;

    // Build query
    let query = {};
    if (search) {
      query.name = { $regex: search, $options: "i" };
    }
    if (branch) {
      query.branch = branch;
    }

    // Fetch from DB already sorted by points
    const students = await Student.find(query).sort({ totalPoint: -1, rand: 1 });

    res.json(students); // Will include stored rank, rankChange, pointsChange
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};


exports.getBranches = async (req, res) => {
  try {
    const branches = await Student.distinct("branch");
    if (!Array.isArray(branches)) {
      return res.json([]);
    }
    res.json(branches.sort());
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
