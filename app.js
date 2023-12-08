const express = require('express');
const app = express();
const port = 3000;
const axios = require('axios');
const db = require('./db/db'); // Ajusta la ruta según la estructura de tu proyecto

app.get('/bosses', async (req, res) => {
  try {
    const response = await axios.get('https://data.ninjakiwi.com/btd6/bosses');
    const bosses = response.data;

    // Consulta para obtener los jefes favoritos desde la base de datos (aún no implementada)

    res.json(bosses);
  } catch (error) {
    console.error('Error al obtener la información de los jefes:', error.message);
    res.status(500).send('Error interno del servidor');
  }
});

// Agrega la ruta para manejar la adición de jefes favoritos aquí (consulta a la base de datos)

app.listen(port, () => {
  console.log(`El servidor está escuchando en http://localhost:${port}`);
});
