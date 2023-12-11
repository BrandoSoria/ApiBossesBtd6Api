// middleware.js

const jwt = require('jsonwebtoken');
const secretKey = 'tu_secreto_jwt';

const authenticateToken = (req, res, next) => {
  const token = req.headers['authorization'];

  if (!token) {
    return res.status(401).json({ error: 'Token no proporcionado' });
  }

  jwt.verify(token.split(' ')[1], secretKey, (err, user) => {
    if (err) {
      console.error('Error al verificar el token:', err.message);
      return res.status(403).json({ error: 'Token no válido', details: err.message });
    }

    console.log('Usuario autenticado:', user);
    req.user = user;
    next();
  });
};

module.exports = {
  authenticateToken,
};
