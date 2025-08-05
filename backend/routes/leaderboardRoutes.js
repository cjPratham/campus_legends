const express = require('express');
const multer = require('multer');
const { uploadCSV, getLeaderboard, getBranches } = require('../controllers/leaderboardController');
const protect = require('../middleware/authMiddleware');


const router = express.Router();
const upload = multer({ dest: 'uploads/' });

router.post('/upload', protect, upload.single('file'), uploadCSV);
router.get('/leaderboard', getLeaderboard);
router.get("/branches", getBranches);


module.exports = router;
