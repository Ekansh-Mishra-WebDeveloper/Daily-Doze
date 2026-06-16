// routes/memberRoutes.js
const express = require('express');
const router = express.Router();
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

// All routes require authentication
router.use(authMember);

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