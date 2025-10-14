const mysql = require('mysql2/promise'); // Importa o driver

const pool = mysql.createPool({
    host: 'localhost',
    user: 'renato', // Usuário que você criou na instalação (ex: 'renato')
    password: 'dw1234', // Senha do usuário
    database: 'login_jwt', // Nome do banco de dados que criamos
    waitForConnections: true,
    connectionLimit: 10,
});

module.exports = pool;