const mysql = require('mysql2/promise'); // Importa o driver

const pool = mysql.createPool({
    host: 'localhost',
    user: 'matheus', // Usuário que você criou na instalação (ex: 'renato')
    password: 'mafp2009', // Senha do usuário
    database: 'login_jwt', // Nome do banco de dados que criamos
    waitForConnections: true,
    connectionLimit: 10,
});

module.exports = pool;