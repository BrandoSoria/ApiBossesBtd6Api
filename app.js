require('dotenv').config();
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const axios = require('axios');
const db = require('./db/db');

app.use(express.json());

app.get('/bosses', async (req, res) => {
  try {
    const response = await axios.get('https://data.ninjakiwi.com/btd6/bosses');
    const bosses = response.data.body;

    const [jefesFavoritos] = await db.query('SELECT * FROM JefesFavoritos');

    res.json({ bosses, jefesFavoritos });
  } catch (error) {
    console.error('Error al obtener la información de los jefes:', error.message);
    res.status(500).json({ error: 'Error al obtener la información de los jefes', details: error.message });
  }
});

app.post('/favoritos/agregar', async (req, res) => {
  const { nombreJefe, imagen } = req.body;

  try {
    if (!nombreJefe) {
      return res.status(400).json({ error: 'Se requiere nombreJefe' });
    }

    const [result] = await db.query('INSERT INTO JefesFavoritos (NombreJefe, Imagen) VALUES (?, ?)', [nombreJefe, imagen]);

    if (result.affectedRows > 0) {
      const jefeAgregado = { Id: result.insertId, NombreJefe: nombreJefe, Imagen: imagen };
      res.status(201).json({ success: true, message: 'Jefe favorito agregado correctamente', jefeAgregado });
    } else {
      res.status(500).json({ error: 'Error al agregar jefe favorito', details: 'No se pudo obtener el jefe recién agregado' });
    }
  } catch (error) {
    console.error('Error al agregar jefe favorito:', error.message);
    res.status(500).json({ error: 'Error al agregar jefe favorito', details: error.message });
  }
});

app.delete('/favoritos/quitar/:id', async (req, res) => {
  const idJefe = req.params.id;

  try {
    const [result] = await db.query('DELETE FROM JefesFavoritos WHERE Id = ?', [idJefe]);

    if (result.affectedRows > 0) {
      res.json({ success: true, message: 'Jefe favorito eliminado correctamente' });
    } else {
      res.status(404).json({ error: 'Jefe favorito no encontrado', details: 'No se pudo encontrar y eliminar el jefe favorito' });
    }
  } catch (error) {
    console.error('Error al quitar jefe favorito:', error.message);
    res.status(500).json({ error: 'Error al quitar jefe favorito', details: error.message });
  }
});

app.listen(port, '0.0.0.0', () => {
  console.log(`El servidor está escuchando en http://0.0.0.0:${port}`);
});
