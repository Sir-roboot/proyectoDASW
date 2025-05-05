// routes/productsManagement.js
const express = require('express');
const router = express.Router();
const ProductManagementRoutes = require('./routesHandlers/ProductManagementRoutes');
const AuthMiddleware = require('./middlewares/AuthMiddleware');

// Solo administradores autenticados pueden acceder
router.use(AuthMiddleware.verifyToken);
router.use(AuthMiddleware.isAdmin);

router.post('/', ProductManagementRoutes.addProduct);
router.put('/:id', ProductManagementRoutes.updateProduct);
router.delete('/:id', ProductManagementRoutes.removeProduct);

module.exports = router;
