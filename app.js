const express = require('express');
const app = express();
const port = 3000; // Puedes cambiar el puerto si es necesario

app.get('/', (req, res) => {
  res.send('¡Hola, mundo!');
});

app.listen(port, () => {
  console.log(`El servidor está escuchando en http://localhost:${port}`);
});
