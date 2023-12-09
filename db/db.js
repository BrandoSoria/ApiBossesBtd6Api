// db.js
const sql = require('mssql');

const config = {
  user: 'brandon',
  password: 'Brandon?',
  server: 'DESKTOP-HQNQOQO',
  database: 'Boss',
  options: {
    encrypt: false,
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
