// routes/usersMangement.js
const express = require('express');
const router = express.Router();
const UserManagementRoutes = require('./routesHandlers/UserManagementRoutes');
const AuthMiddleware = require('./middlewares/AuthMiddleware');

// Solo administradores autenticados pueden gestionar usuarios
router.use(AuthMiddleware.verifyToken);
router.use(AuthMiddleware.isAdmin);

router.get('/', UserManagementRoutes.getUsers);
router.get('/:id', UserManagementRoutes.getUserById);
router.put('/:id/role', UserManagementRoutes.changeUserRole);
router.delete('/:id', UserManagementRoutes.removeUser);

module.exports = router;
