const express = require('express');
const router = express.Router();
const AuthRoutes = require('./routesHandlers/AuthRoutes'); // si está en la misma carpeta

router.post('/login', AuthRoutes.login);
router.post('/register', AuthRoutes.register);

module.exports = router;
