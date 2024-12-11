const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
  const token = req.header('Authorization')?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'Accès refusé. Token manquant.' });
  }

  try {
    const verifiedUser = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verifiedUser; // Ajoute les données utilisateur au `req`
    next(); // Passe à l'étape suivante (controller)
  } catch (err) {
    res.status(400).json({ message: 'Token invalide.' });
  }
};
