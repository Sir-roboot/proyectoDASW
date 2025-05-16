/**
 * Router de Express para el carrito de compras.
 * Todas las rutas requieren autenticación mediante middleware.
 */
const express = require('express');
const router = express.Router();
const CartRoutes = require('./routesHandlers/CartRoutes');
const AuthMiddleware = require('./middlewares/AuthMiddleware');

// Protege todas las rutas con autenticación
router.use(AuthMiddleware.verifyToken);

// Obtener el carrito actual del usuario autenticado
router.get('/', CartRoutes.getCart);

// Agregar un producto al carrito
router.post('/add', CartRoutes.addToCart);

// Actualizar la cantidad de un producto en el carrito
router.put('/update', CartRoutes.updateCartItemAmount);

// Eliminar un producto del carrito por ID
router.delete('/remove/:productId', CartRoutes.removeCartItem);

// Realizar la compra del carrito
router.post('/purchase', CartRoutes.purchesCart);

// Vaciar completamente el carrito
router.delete('/clean', CartRoutes.cleanCart);

module.exports = router;
