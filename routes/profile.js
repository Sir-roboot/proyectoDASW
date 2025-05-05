const express = require('express');
const router = express.Router();
const ProfileRoutes = require('./routesHandlers/ProfileRoutes');
const AuthMiddleware = require('./middlewares/AuthMiddleware');

router.use(AuthMiddleware.verifyToken); // Protege todas las rutas de este archivo

router.get('/', ProfileRoutes.getProfile); // Ya no necesitas :id
router.put('/', ProfileRoutes.updateProfile);
router.get('/purchase-history', ProfileRoutes.getPurchaseHistory);

module.exports = router;
