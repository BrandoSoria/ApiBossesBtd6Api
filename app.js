require('dotenv').config();
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const axios = require('axios');
const mysql = require('mysql2/promise');
const db = require('./db/db');

app.use(express.json());

app.get('/bosses', async (req, res) => {
  try {
    const response = await axios.get('https://data.ninjakiwi.com/btd6/bosses');
    const bosses = response.data;

    const connection = await db.connectToDatabase();
    const [rows] = await connection.query('SELECT * FROM JefesFavoritos');
    connection.end(); // Cerrar la conexión después de usarla

    res.json({ bosses, jefesFavoritos: rows });
  } catch (error) {
    console.error('Error al obtener la información de los jefes:', error.message);
    res.status(500).json({ error: 'Error al obtener la información de los jefes', details: error.message });
  }
});

app.post('/favoritos/agregar', async (req, res) => {
  const { nombreJefe, imagen } = req.body;

  try {
    // Verificar que se haya proporcionado nombreJefe
    if (!nombreJefe) {
      return res.status(400).json({ error: 'Se requiere nombreJefe' });
    }

    const connection = await db.connectToDatabase();
    const [result] = await connection.query(
      'INSERT INTO JefesFavoritos (NombreJefe, Imagen) VALUES (?, ?)',
      [nombreJefe, imagen]
    );
    connection.end(); // Cerrar la conexión después de usarla

    const [jefesAgregados] = await connection.query(
      'SELECT * FROM JefesFavoritos WHERE NombreJefe = ?',
      [nombreJefe]
    );

    if (jefesAgregados.length > 0) {
      const jefeAgregado = jefesAgregados[0];
      res.status(201).json({ success: true, message: 'Jefe favorito agregado correctamente', jefeAgregado });
    } else {
      res.status(500).json({ error: 'Error al agregar jefe favorito', details: 'No se pudo obtener el jefe recién agregado' });
    }
  } catch (error) {
    console.error('Error al agregar jefe favorito:', error.message);
    res.status(500).json({ error: 'Error al agregar jefe favorito', details: error.message });
  }
});

app.delete('/favoritos/quitar/:nombreJefe', async (req, res) => {
  const nombreJefe = req.params.nombreJefe;

  try {
    const connection = await db.connectToDatabase();
    await connection.query('DELETE FROM JefesFavoritos WHERE NombreJefe = ?', [nombreJefe]);
    connection.end(); // Cerrar la conexión después de usarla

    res.json({ success: true, message: 'Jefe favorito eliminado correctamente' });
  } catch (error) {
    console.error('Error al quitar jefe favorito:', error.message);
    res.status(500).json({ error: 'Error al quitar jefe favorito', details: error.message });
  }
});

app.listen(port, '0.0.0.0', () => {
  console.log(`El servidor está escuchando en http://0.0.0.0:${port}`);
});
