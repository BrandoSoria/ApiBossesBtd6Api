
const mysql = require('mysql2');

const config = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 3306, // Puerto predeterminado de MySQL
};

async function connectToDatabase() {
  try {
    const connection = await mysql.createConnection(config);
    console.log('Conexión exitosa a la base de datos');
    connection.release(); // Liberar la conexión después de su uso
  }
}

module.exports = { connectToDatabase };
