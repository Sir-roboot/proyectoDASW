// routes/cart.js
const express = require('express');
const router = express.Router();
const CartRoutes = require('./routesHandlers/CartRoutes');
const AuthMiddleware = require('./middlewares/AuthMiddleware');

// Protege todas las rutas con autenticación
router.use(AuthMiddleware.verifyToken);

router.get('/', CartRoutes.getCart);
router.post('/add', CartRoutes.addToCart);
router.put('/update', CartRoutes.updateCartItemAmount);
router.delete('/remove/:productId', CartRoutes.removeCartItem);

module.exports = router;
