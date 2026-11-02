const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'archive_academy_super_secret_jwt_key_2025';

function generateToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

function verifyToken(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: 'Akses ditolak: Token tidak ditemukan.' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: 'Sesi kedaluwarsa atau token tidak valid.' });
  }
}

function requireRole(roles) {
  const allowed = Array.isArray(roles) ? roles : [roles];
  return (req, res, next) => {
    if (!req.user || !allowed.includes(req.user.role)) {
      return res.status(403).json({ success: false, message: 'Akses terlarang untuk peran ini.' });
    }
    next();
  };
}

module.exports = {
  JWT_SECRET,
  generateToken,
  verifyToken,
  requireRole
};
