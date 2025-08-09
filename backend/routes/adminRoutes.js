const express = require("express");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const Student = require("../models/Student"); // make sure path is correct

const router = express.Router();

// TODO: Replace with DB lookup
const ADMIN_EMAIL = "admin@gmail.com";
const ADMIN_PASSWORD = "supersecret";

// Middleware to verify admin token
function verifyAdmin(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ success: false, message: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "fallbacksecret");
    if (decoded.role !== "admin") {
      return res.status(403).json({ success: false, message: "Not authorized" });
    }
    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: "Invalid token" });
  }
}

// Admin login
router.post("/login", (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Email and password are required" });
    }

    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      const token = jwt.sign({ role: "admin" }, process.env.JWT_SECRET || "fallbacksecret", {
        expiresIn: "2h"
      });

      return res.status(200).json({
        success: true,
        message: "Login successful",
        token
      });
    }

    return res.status(401).json({ success: false, message: "Invalid credentials" });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
});

// Reset leaderboard changes
router.post("/reset-changes", verifyAdmin, async (req, res) => {
  try {
    await Student.updateMany({}, {
      $set: {
        previousPoints: null,
        pointsChange: 0,
        rankChange: 0
      }
    });

    res.json({ success: true, message: "All rank and point changes reset successfully" });
  } catch (err) {
    console.error("Error resetting changes:", err);
    res.status(500).json({ success: false, message: "Server error while resetting changes" });
  }
});

// Delete all students - FULL reset of database entries
router.delete("/reset-data", verifyAdmin, async (req, res) => {
  try {
    await Student.deleteMany({});
    res.json({ success: true, message: "All student data deleted successfully." });
  } catch (err) {
    console.error("Error deleting data:", err);
    res.status(500).json({ success: false, message: "Server error while deleting data" });
  }
});

module.exports = router;
