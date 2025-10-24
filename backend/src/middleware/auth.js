// backend/src/middleware/auth.js
const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  // MUDANÇA CRÍTICA: BUSCAR O TOKEN NO COOKIE 'jwt'
  // O cookie 'jwt' é preenchido pelo navegador graças ao 'withCredentials: true' no frontend
  const token = req.cookies.jwt;

  // Se não houver token, o acesso é negado com o código 401 (Unauthorized)
  if (!token) {
    return res.status(401).json({ message: 'Acesso negado. Token não fornecido.' });
  }

  try {
    // Tenta verificar se o token é válido, usando o nosso segredo
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Se for válido, adiciona o 'payload' do token na requisição para ser usado depois
    req.user = decoded;

    // Chama a próxima função/middleware na cadeia
    next();

  } catch (err) {
    // Se o token for inválido, a resposta é negada com o código 403 (Forbidden)
    return res.status(403).json({ message: 'Token inválido.' });
  }
};

module.exports = verifyToken;
