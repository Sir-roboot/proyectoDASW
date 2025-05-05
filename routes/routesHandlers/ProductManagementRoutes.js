const AdminService = require('../../Classes/ServicesClasses/AdminService');

class ProductManagementRoutes {
    static async addProduct(req, res) {
        try {
            const result = await AdminService.addProduct(req.body);
            res.status(201).json(result);
        } catch (err) {
            res.status(500).json({ success: false, error: err.message });
        }
    }

    static async updateProduct(req, res) {
        try {
            const result = await AdminService.updateProduct(req.params.id, req.body);
            res.status(200).json(result);
        } catch (err) {
            res.status(500).json({ success: false, error: err.message });
        }
    }

    static async removeProduct(req, res) {
        try {
            const result = await AdminService.removeProduct(req.params.id);
            res.status(200).json(result);
        } catch (err) {
            res.status(500).json({ success: false, error: err.message });
        }
    }
}

module.exports = ProductManagementRoutes;