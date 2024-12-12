const jwt = require('jsonwebtoken');
const SECRET_KEY = process.env.JWT_SECRET || 'votre_clé_secrète';

const jwtMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).send({ error: 'Token manquant ou invalide.' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).send({ error: 'Token invalide ou expiré.' });
  }
};

module.exports = jwtMiddleware;