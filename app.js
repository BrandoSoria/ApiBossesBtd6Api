require('dotenv').config();
const express = require('express');
const app = express();
const port = process.env.PORT || 3000; // Utilizando el puerto especificado en la variable de entorno o 3000 por defecto
const axios = require('axios');
const sql = require('mysql2');
const db = require('./db/db'); // Ajusta la ruta según la estructura de tu proyecto

// Middleware para parsear el cuerpo de las solicitudes como JSON
app.use(express.json());

// Ruta para obtener información de los jefes de la API de Ninja Kiwi y jefes favoritos
app.get('/bosses', async (req, res) => {
  try {
    // Obtener información de los jefes de la API de Ninja Kiwi
    const response = await axios.get('https://data.ninjakiwi.com/btd6/bosses');
    const bosses = response.data;

    // Obtener jefes favoritos desde la base de datos
    const result = await db.request().query('SELECT * FROM JefesFavoritos');
    const jefesFavoritos = result.recordset;

    // Enviar la información de jefes de la API y jefes favoritos en la respuesta JSON
    res.json({ bosses, jefesFavoritos });
  } catch (error) {
    console.error('Error al obtener la información de los jefes:', error.message);
    res.status(500).json({ error: 'Error al obtener la información de los jefes', details: error.message });
  }
});

// Ruta para agregar un jefe favorito
app.post('/favoritos/agregar', async (req, res) => {
  const { nombreJefe, imagen } = req.body;

  try {
    // Verificar que se haya proporcionado nombreJefe
    if (!nombreJefe) {
      return res.status(400).json({ error: 'Se requiere nombreJefe' });
    }

    // Insertar el jefe favorito en la base de datos
    const result = await db.request()
      .input('nombreJefe', sql.NVarChar, nombreJefe)
      .input('imagen', sql.VarChar(sql.MAX), imagen) // Cambiando el tipo de dato aquí
      .query(`
        INSERT INTO JefesFavoritos (NombreJefe, Imagen)
        VALUES (@nombreJefe, @imagen);

        SELECT * FROM JefesFavoritos WHERE NombreJefe = @nombreJefe;
      `);

    // Verificar si la respuesta contiene resultados y tomar el primer elemento
    const jefesAgregados = result.recordset;

    // Verificar si se encontraron jefes recién agregados
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

// Ruta para quitar un jefe favorito
app.delete('/favoritos/quitar/:nombreJefe', async (req, res) => {
  const nombreJefe = req.params.nombreJefe;

  try {
    // Eliminar el jefe favorito de la base de datos
    const result = await db.request()
      .input('nombreJefe', sql.NVarChar, nombreJefe)
      .query(`
        DELETE FROM JefesFavoritos
        WHERE NombreJefe = @nombreJefe
      `);

    res.json({ success: true, message: 'Jefe favorito eliminado correctamente' });
  } catch (error) {
    console.error('Error al quitar jefe favorito:', error.message);
    res.status(500).json({ error: 'Error al quitar jefe favorito', details: error.message });
  }
});

// Iniciar el servidor
app.listen(port, '0.0.0.0', () => {
  console.log(`El servidor está escuchando en http://0.0.0.0:${port}`);
});
