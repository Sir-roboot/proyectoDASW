const ProductService = require('../../Classes/ServicesClasses/ProductService');
const CategoryService = require('../../Classes/ServicesClasses/CategoryService.js'); 
const Service = require("../../AbstractClasses/Service.js");
const { Product, Category } = require("../../Models/models.js");
const CategoryClass = require("../../Classes/Category.js");
const ProductClass = require("../../AbstractClasses/Product.js");
/**
 * Controlador estático para manejar las rutas de productos (API REST).
 */
class ProductRoutes {

    /**
     * Crea un producto nuevo.
     * @param {import('express').Request} req
     * @param {import('express').Response} res
     */
    static async createProduct(req, res) {
        try {
            const { productData } = req.body;
            const result = await ProductService.createProduct(Product, productData, ProductClass, Service);
            res.status(200).json(result);
        } catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    }

    /**
     * Actualiza un producto existente.
     * @param {import('express').Request} req
     * @param {import('express').Response} res
     */
    static async updateProduct(req, res) {
        try {
            const { idProduct, productData } = req.body;
            const result = await ProductService.updateProduct(Product, idProduct, productData, CategoryClass, Service);

            if (result) {
                res.status(200).json({ message: "Actualización del producto con éxito." });
            } else {
                res.status(404).json({ message: "Producto no actualizado." });
            }
        } catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    }

    /**
     * Elimina un producto por ID.
     * @param {import('express').Request} req
     * @param {import('express').Response} res
     */
    static async deleteProduct(req, res) {
        try {
            const { idProduct } = req.body;
            const result = await ProductService.deleteProduct(Product, idProduct, Service);

            if (result) {
                res.status(200).json({ message: "Producto eliminado correctamente." });
            } else {
                res.status(404).json({ message: 'Producto no encontrado.' });
            }
        } catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    }

    /**
     * Obtiene un producto por su ID.
     * @param {import('express').Request} req
     * @param {import('express').Response} res
     */
    static async getProductById(req, res) {
        try {
            const result = await ProductService.getProductDetails(req.params.id, Product, Service);
            if (result) {
                res.status(200).json(result);
            } else {
                res.status(404).json({ message: 'Producto no encontrado' });
            }
        } catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    }

    /**
     * Obtiene todos los productos con filtros opcionales.
     * @param {import('express').Request} req
     * @param {import('express').Response} res
     */
    static async getAllProducts(req, res) {
        try {
            const result = await ProductService.getProducts(Product, req.query, Service);
            res.status(200).json({success :true, products: result, numElements: result.length});
        } catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    }

    /**
     * Obtener las categorias existentes
     * @param {import('express').Request} req
     * @param {import('express').Response} res
     */
    static async getCategories(req, res) {
        try {
            const result = await CategoryService.getCategories(Category,Service);
            res.status(200).json({ success: true,  categories: result });
        } catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    }

    /**
     * Obtener el precio minimo y maximo de los productos
     * @param {import('express').Request} req
     * @param {import('express').Response} res
     */
    static async prices(req, res) {
        try {
            const result = await ProductService.getPrices(Product,Service);
            res.status(200).json({success: true, min: result[0], max: result[1]});
        } catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    }
}

module.exports = ProductRoutes;
