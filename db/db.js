// db.js
const mysql = require('mysql2');

const config = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_SERVER,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 3306, // Cambia al puerto correcto si es necesario
};

const pool = mysql.createPool(config);

pool.getConnection((err, connection) => {
  if (err) {
    console.error('Error al conectar a la base de datos:', err.message);
  } else {
    console.log('Conexión exitosa a la base de datos');
    connection.release();
  }
});

module.exports = pool;
