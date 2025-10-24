// backend/server.js
require('dotenv').config(); // Isso deve ser a primeira linha

// === 1. IMPORTAÇÕES ===
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const express = require('express');
const cors = require('cors'); // Habilita a comunicação entre domínios
const cookieParser = require('cookie-parser'); // NOVIDADE

// Importa suas rotas de autenticação e rotas privadas
const authRoutes = require('./src/routes/auth.routes.js');
const privateRoutes = require('./src/routes/private.routes.js');

// === 2. INICIALIZAÇÃO DO APP ===
const app = express();
const PORT = process.env.PORT || 5000; // Define a porta, com 5000 como fallback

// --- 3. MIDDLEWARES DE SEGURANÇA E BÁSICOS ---
// Middleware para entender JSON (deve ser um dos primeiros)
app.use(express.json());
app.use(cookieParser()); // Habilita a leitura de req.cookies

// 1. Defesa de Cabeçalhos (Helmet)
app.use(helmet());

// 2. Limitação de Requisições (Rate Limiting)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100 // Máximo de 100 requisições por IP
});
app.use(limiter);

// 3. Permissão de Acesso (CORS)
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true // Permite envio e recebimento de cookies
}));

// --- 4. CONFIGURAÇÃO DAS ROTAS ---
// Rotas públicas
app.use('/api/auth', authRoutes);

// Rotas protegidas
app.use('/api', privateRoutes);

// --- 5. INICIALIZAÇÃO DO SERVIDOR ---
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
