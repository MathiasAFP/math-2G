// backend/src/routes/auth.routes.js
const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../utils/db'); // NOVIDADE: Importa o módulo de conexão com o MySQL
const { body, validationResult } = require('express-validator');

// ----------------------------------------------------------------------
// ROTA DE REGISTRO (POST /register) - INSERINDO DADOS NO MYSQL
// ----------------------------------------------------------------------
router.post(
  '/register',
  [
    // NOVIDADE 2: Regras de Validação
    body('email').isEmail().withMessage('O e-mail fornecido não é válido.'),
    body('password').isLength({ min: 6 }).withMessage('A senha deve ter no mínimo 6 caracteres.')
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
      // 1. Criptografa a senha antes de salvar
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      // 2. Executa a query de INSERÇÃO no MySQL
      await db.execute(
        'INSERT INTO users (email, password) VALUES (?, ?)',
        [email, hashedPassword]
      );

      res.status(201).json({ message: 'Usuário registrado com sucesso.' });

    } catch (error) {
      // Trata o erro de email duplicado (ER_DUP_ENTRY do MySQL)
      if (error.code === 'ER_DUP_ENTRY') {
        return res.status(400).json({ message: 'Email já cadastrado.' });
      }
      res.status(500).json({ message: 'Erro no servidor.' });
    }
  }
);

// ----------------------------------------------------------------------
// ROTA DE LOGIN (POST /login) - VALIDANDO DADOS NO MYSQL
// ----------------------------------------------------------------------
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // 1. Busca o usuário no banco
    const [rows] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);
    const user = rows[0];

    if (!user) {
      return res.status(401).json({ message: 'Credenciais inválidas.' });
    }

    // 2. Compara a senha digitada com o hash do banco
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Credenciais inválidas.' });
    }

    // 3. Gera o JWT e envia no cookie
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.cookie('jwt', token, {
      httpOnly: true, // NENHUM JavaScript pode ler este cookie (Proteção XSS)
      secure: process.env.NODE_ENV === 'production', // Use 'true' apenas em HTTPS
      maxAge: 3600000 // 1 hora
    });

    res.status(200).json({ message: 'Login bem-sucedido. Token enviado via cookie.' });

  } catch (error) {
    res.status(500).json({ message: 'Erro no servidor.' });
  }
});

module.exports = router;
