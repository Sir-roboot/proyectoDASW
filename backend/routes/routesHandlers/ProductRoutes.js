const ProductService = require('../../Classes/ServicesClasses/ProductService');

class ProductRoutes {
    static async getAllProducts(req, res) {
        try {
            const result = await ProductService.getAllProducts(req.query);
            res.status(200).json(result);
        } catch (err) {
            res.status(500).json({ success: false, error: err.message });
        }
    }

    static async getProductById(req, res) {
        try {
            const result = await ProductService.getProductById(req.params.id);
            res.status(result ? 200 : 404).json(result || { message: 'Producto no encontrado' });
        } catch (err) {
            res.status(500).json({ success: false, error: err.message });
        }
    }
}

module.exports = ProductRoutes;
