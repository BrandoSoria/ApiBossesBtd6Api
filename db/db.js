const mysql = require('mysql2/promise'); // Uso de 'mysql2/promise' para trabajar con Promesas

const config = {
  host: process.env.DB_SERVER,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 3306, // Puerto típico de MySQL
};

// Función para conectar a la base de datos
async function connectToDatabase() {
  try {
    const connection = await mysql.createConnection(config);
    console.log('Conexión exitosa a la base de datos');
    return connection;
  } catch (err) {
    console.error('Error al conectar a la base de datos:', err.message);
    throw err;
  }
}

// Exportar la función de conexión
module.exports = {
  connectToDatabase,
};
