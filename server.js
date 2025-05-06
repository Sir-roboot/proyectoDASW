const express = require('express');
const app = express();
const cors = require('cors');
const router = require('./controllers/router'); // Este es el archivo que tú ya tienes

// Middlewares
app.use(cors());
app.use(express.json());

// Montar las rutas principales
app.use('/api', router);

// Puerto del servidor
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.json({ status: 'ok', up: true });
});


app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});
