const express = require('express');
const router = express.Router();
const ProductRoutes = require('./routesHandlers/ProductRoutes');

router.get('/', ProductRoutes.getAllProducts);
router.get('/:id', ProductRoutes.getProductById);

module.exports = router;
