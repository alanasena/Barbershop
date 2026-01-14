const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
  try {
    // Verificar se há token no header ou cookie
    const token = req.headers.authorization?.split(' ')[1] || req.cookies?.token;
    
    if (!token) {
      return res.status(401).json({ error: 'Acesso negado. Token não fornecido.' });
    }

    // Verificar e decodificar o token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret_key_change_in_production');
    
    // Adicionar informações do usuário ao request
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Token inválido ou expirado.' });
  }
};

const adminAuth = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1] || req.cookies?.token;
    
    if (!token) {
      return res.status(401).json({ error: 'Acesso negado. Token não fornecido.' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret_key_change_in_production');
    
    // Permitir acesso para admin ou barbeiro
    if (!decoded.admin && !decoded.barber) {
      return res.status(403).json({ error: 'Acesso negado. Apenas administradores ou barbeiros.' });
    }

    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Token inválido ou expirado.' });
  }
};

module.exports = { auth, adminAuth };
