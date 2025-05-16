// Importa express y la clase que orquesta los endpoints de gestión de usuarios
const express = require('express');
const router = express.Router();
const UserManagementRoutes = require('./routesHandlers/UserManagementRoutes');
const AuthMiddleware = require('./middlewares/AuthMiddleware');

/**
 * Rutas protegidas para la gestión de usuarios customer.
 * Solo pueden ser accedidas por administradores autenticados.
 */

// Middleware de autenticación (debe estar antes de las rutas protegidas)
router.use(AuthMiddleware.verifyToken);
// Middleware de autorización (solo admins)
router.use(AuthMiddleware.isAdmin);

// GET /           - Obtiene la lista de todos los usuarios customer
router.get('/', UserManagementRoutes.getUsers);

// PUT /:id        - Actualiza los datos de un usuario customer (se espera el nuevo data en body)
router.put('/:id', UserManagementRoutes.updateCustomer);

// DELETE /:id     - Elimina un usuario customer por id
router.delete('/:id', UserManagementRoutes.removeUser);

module.exports = router;
