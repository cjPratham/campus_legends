const express = require("express");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const router = express.Router();

// TODO: Replace with DB lookup
const ADMIN_EMAIL = "admin@gmail.com";
const ADMIN_PASSWORD = "supersecret";

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

module.exports = router;
