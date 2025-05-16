const express = require('express');
const router = express.Router();
const ProfileRoutes = require('./routesHandlers/ProfileRoutes');
const AuthMiddleware = require('./middlewares/AuthMiddleware');

/**
 * Rutas protegidas para el perfil del usuario autenticado.
 * Todas requieren que el usuario esté logueado (token válido).
 */
router.use(AuthMiddleware.verifyToken); // Protege todas las rutas de este archivo

// GET /                  - Obtiene el perfil completo del usuario autenticado
router.get('/', ProfileRoutes.getProfile);

// PUT /                  - Actualiza el perfil del usuario autenticado
router.put('/', ProfileRoutes.updateProfile);

// GET /purchase-history  - Obtiene el historial de compras del usuario autenticado
router.get('/purchase-history', ProfileRoutes.getPurchaseHistory);

module.exports = router;
