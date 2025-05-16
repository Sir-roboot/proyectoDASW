// Importa el framework Express y el manejador de rutas de autenticación
const express = require('express');
const router = express.Router();

// Importa la clase de rutas de autenticación, la cual orquesta los endpoints principales
const AuthRoutes = require('./routesHandlers/AuthRoutes');

// Ruta para iniciar sesión (login)
router.post('/login', AuthRoutes.login);

// Ruta para registro de usuario nuevo
router.post('/register', AuthRoutes.register);

// Ruta para refrescar el token de acceso usando un refresh token válido
router.post('/refresh', AuthRoutes.refreshToken);

// Exporta el router para que pueda ser utilizado en la app principal de Express
module.exports = router;
