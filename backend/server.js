require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const router = require('./controllers/router.js');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Montar las rutas principales
app.use('/CampingHouse', router);

// Puerto del servidor
const PORT = process.env.PORT || 3000;

// URI de conexión (puedes moverlo a .env si quieres)
const MONGO_URI = 'mongodb://127.0.0.1:27017/campingDB'; // Puedes cambiar "campingDB" por el nombre de tu base

// Conectar a MongoDB y luego iniciar el servidor
mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log('✅ Conectado a MongoDB');

  app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
  });
})
.catch((error) => {
  console.error('❌ Error al conectar a MongoDB:', error);
});
