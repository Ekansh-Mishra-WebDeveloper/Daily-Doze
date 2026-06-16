// routes/memberAuthRoutes.js
const express = require('express');
const router = express.Router();
const { registerMember, loginMember } = require('../controllers/memberAuthController');

router.post('/member-register', registerMember);
router.post('/member-login', loginMember);

module.exports = router;