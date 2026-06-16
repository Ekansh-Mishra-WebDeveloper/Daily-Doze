// routes/memberRoutes.js
const express = require('express');
const router = express.Router();
const multer = require('multer');
const { cloudinary } = require('../config/cloudinary');
const authMember = require('../middleware/authMember');
const {
  getProfile,
  updateProfile,
  changePassword,
  getAttendanceLogs,
  recordAttendance,
  getWeightHistory,
  addWeight,
  getExercisePRs,
  updateExercisePRs
} = require('../controllers/memberController');

const storage = multer.memoryStorage();
const upload = multer({ storage });

// All routes require authentication
router.use(authMember);

// Member upload endpoint
router.post('/upload', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    const result = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder: 'ultrafit_members' },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      uploadStream.end(req.file.buffer);
    });
    res.json({ url: result.secure_url });
  } catch (err) {
    console.error('Upload error:', err);
    res.status(500).json({ error: 'Upload failed' });
  }
});

router.get('/profile', getProfile);
router.put('/profile', updateProfile);
router.post('/change-password', changePassword);
router.get('/attendance/logs', getAttendanceLogs);
router.post('/attendance', recordAttendance);
router.get('/weight-history', getWeightHistory);
router.post('/weight', addWeight);
router.get('/exercise-prs', getExercisePRs);
router.put('/exercise-prs', updateExercisePRs);

module.exports = router;