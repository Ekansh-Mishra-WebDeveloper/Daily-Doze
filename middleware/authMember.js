// middleware/authMember.js
const jwt = require('jsonwebtoken');
const Member = require('../models/Member');

module.exports = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find member and attach to request
    const member = await Member.findById(decoded.id).select('-password');
    if (!member) {
      return res.status(401).json({ error: 'Member not found' });
    }

    req.memberId = decoded.id;
    req.member = member;
    next();
  } catch (err) {
    if (err.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: 'Invalid token' });
    }
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expired' });
    }
    res.status(500).json({ error: 'Server error' });
  }
};