const express = require('express');
const app = express();
const port = 3000;
const axios = require('axios');
const db = require('./db/db'); // Ajusta la ruta según la estructura de tu proyecto

// Ruta para obtener información de los jefes de la API de Ninja Kiwi y jefes favoritos
app.get('/bosses', async (req, res) => {
  try {
    // Obtener información de los jefes de la API de Ninja Kiwi
    const response = await axios.get('https://data.ninjakiwi.com/btd6/bosses');
    const bosses = response.data;

    // Obtener jefes favoritos desde la base de datos
    const result = await db.request().query('SELECT * FROM JefesFavoritos');
    const jefesFavoritos = result.recordset;

    // Combinar la información de jefes de la API y jefes favoritos
    const todosLosJefes = [...bosses, ...jefesFavoritos];

    // Enviar la información de todos los jefes
    res.json(todosLosJefes);
  } catch (error) {
    console.error('Error al obtener la información de los jefes:', error.message);
    res.status(500).send('Error interno del servidor');
  }
});

// Middleware para parsear el cuerpo de las solicitudes como JSON
app.use(express.json());

// Ruta para agregar un jefe favorito
app.post('/favoritos/agregar', async (req, res) => {
  const { nombreJefe, imagen } = req.body;

  try {
    // Insertar el jefe favorito en la base de datos
    const result = await db.request()
      .input('nombreJefe', db.NVarChar, nombreJefe)
      .input('imagen', db.NVarChar, imagen)
      .query(`
        INSERT INTO JefesFavoritos (NombreJefe, Imagen)
        VALUES (@nombreJefe, @imagen)
      `);

    res.status(201).json({ message: 'Jefe favorito agregado correctamente' });
  } catch (error) {
    console.error('Error al agregar jefe favorito:', error.message);
    res.status(500).send('Error interno del servidor');
  }
});

// Ruta para quitar un jefe favorito
app.delete('/favoritos/quitar/:nombreJefe', async (req, res) => {
  const nombreJefe = req.params.nombreJefe;

  try {
    // Eliminar el jefe favorito de la base de datos
    const result = await db.request()
      .input('nombreJefe', db.NVarChar, nombreJefe)
      .query(`
        DELETE FROM JefesFavoritos
        WHERE NombreJefe = @nombreJefe
      `);

    res.json({ message: 'Jefe favorito eliminado correctamente' });
  } catch (error) {
    console.error('Error al quitar jefe favorito:', error.message);
    res.status(500).send('Error interno del servidor');
  }
});

// Iniciar el servidor
app.listen(port, () => {
  console.log(`El servidor está escuchando en http://localhost:${port}`);
});
