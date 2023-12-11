const sql = require('mssql');

const config = {
  user: process.env.CLEVER_CLOUD_DB_USER,
  password: process.env.CLEVER_CLOUD_DB_PASSWORD,
  server: process.env.CLEVER_CLOUD_DB_SERVER,
  database: process.env.CLEVER_CLOUD_DB_NAME,
  port: process.env.CLEVER_CLOUD_DB_PORT || 1433, // Ajusta el puerto según la configuración de tu base de datos
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
