// db.js
const sql = require('mssql');

const config = {
  server: 'localhost',
  database: 'Boss',
  options: {
    trustedConnection: true, // Habilita la autenticación de Windows
  },
};

const pool = new sql.ConnectionPool(config);

pool.connect(err => {
  if (err) {
    console.error('Error al conectar a la base de datos:', err.message);
  } else {
    console.log('Conexión exitosa a la base de datos');
  }
});

module.exports = pool;
