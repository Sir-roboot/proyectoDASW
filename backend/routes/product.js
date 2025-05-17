/**
 * Router de Express para las rutas de productos.
 * Define los endpoints para crear, actualizar, eliminar y consultar productos.
 */
const express = require('express');
const router = express.Router();
const ProductRoutes = require('./routesHandlers/ProductRoutes');

// Crea un nuevo producto
router.post('/create', ProductRoutes.createProduct);

// Actualiza un producto existente
router.put('/update', ProductRoutes.updateProduct);

// Elimina un producto por su ID (en body)
router.delete('/delete', ProductRoutes.deleteProduct);

// Obtiene un producto por su ID (en path param)
router.get('/:id', ProductRoutes.getProductById);

// Obtiene todos los productos, opcionalmente filtrados por query params
router.get('/', ProductRoutes.getAllProducts);

// Obtener las categorias exitentes
router.get('/category', ProductRoutes.getCategories);

// Obtener rango de precios
router.get('/prices-range', ProductRoutes.prices);

module.exports = router;