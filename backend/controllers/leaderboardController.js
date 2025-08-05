const Student = require("../models/Student");
const Papa = require("papaparse");
const fs = require("fs");

exports.uploadCSV = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "CSV file is required" });
    }

    const filePath = req.file.path;
    const fileContent = fs.readFileSync(filePath, "utf8");

    Papa.parse(fileContent, {
      header: true,
      skipEmptyLines: true,
      complete: async (results) => {
        try {
          const normalize = (str) =>
            str?.toString().trim().replace(/^\uFEFF/, "");

          const cleanedData = results.data
            .map((row) => ({
              name: normalize(row["Name"]),
              branch: normalize(row["Branch"]),
              totalPoint: Number(
                normalize(row["TotalPoints"])?.replace(/,/g, "") || 0
              ),
              rand: Math.floor(Math.random() * 1000), // tie-breaker
            }))
            .filter(
              (s) =>
                s.name &&
                s.branch &&
                !isNaN(s.totalPoint) &&
                !isNaN(s.rand)
            );

          console.log(`Cleaned data count: ${cleanedData.length}`);

          // Delete old data before inserting new
          await Student.deleteMany({});

          if (cleanedData.length > 0) {
            await Student.insertMany(cleanedData);
          }

          // Remove uploaded file
          fs.unlinkSync(filePath);

          return res.json({
            message: `${cleanedData.length} students added successfully (old data replaced)`,
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

    // Fetch all sorted students
    const allStudents = await Student.find().sort({ totalPoint: -1, rand: 1 });

    // Assign ranks
    const rankedStudents = allStudents.map((student, index) => ({
      ...student.toObject(),
      rank: index + 1,
    }));

    // Apply search & filter AFTER ranking
    const filtered = rankedStudents.filter((s) => {
      let matches = true;
      if (search) {
        matches =
          matches &&
          s.name.toLowerCase().includes(search.toLowerCase());
      }
      if (branch) {
        matches = matches && s.branch === branch;
      }
      return matches;
    });

    res.json(filtered);
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
