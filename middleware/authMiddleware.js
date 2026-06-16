const jwt = require('jsonwebtoken');

const protect = (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  console.log('Authorization header:', req.headers.authorization);
  console.log('Extracted token:', token);

  if (!token) {
    return res.status(401).json({ error: 'Not authorized, no token' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Token verified successfully');
    req.admin = decoded;
    next();
  } catch (error) {
    console.error('JWT verification error:', error.message);
    return res.status(401).json({ error: 'Not authorized, token failed' });
  }
};

module.exports = { protect };