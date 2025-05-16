const express = require('express');
const router = express.Router();
const ProductManagementRoutes = require('./routesHandlers/ProductManagementRoutes');
const AuthMiddleware = require('./middlewares/AuthMiddleware');

/**
 * Rutas protegidas para la gestión de productos (solo para administradores).
 * Todas requieren autenticación y privilegios de administrador.
 */
router.use(AuthMiddleware.verifyToken); // Solo usuarios autenticados
router.use(AuthMiddleware.isAdmin);     // Solo administradores

// POST /             - Agrega un nuevo producto (datos en el body)
router.post('/', ProductManagementRoutes.addProduct);

// PUT /:id           - Actualiza un producto existente por su ID (datos en el body)
router.put('/:id', ProductManagementRoutes.updateProduct);

// DELETE /:id        - Elimina un producto por su ID
router.delete('/:id', ProductManagementRoutes.removeProduct);

module.exports = router;
