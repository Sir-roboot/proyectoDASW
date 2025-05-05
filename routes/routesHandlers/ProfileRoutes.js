const CustomerService = require('../../Classes/ServicesClasses/CustomerService');

class ProfileRoutes {
    static async getProfile(req, res) {
        try {
            const result = await CustomerService.getProfile(req.userId);
            res.status(200).json(result);
        } catch (err) {
            res.status(500).json({ success: false, error: err.message });
        }
    }

    static async updateProfile(req, res) {
        try {
            const result = await CustomerService.updateProfile(req.userId, req.body);
            res.status(200).json(result);
        } catch (err) {
            res.status(500).json({ success: false, error: err.message });
        }
    }

    static async getPurchaseHistory(req, res) {
        try {
            const result = await CustomerService.getPurchaseHistory(req.userId);
            res.status(200).json(result);
        } catch (err) {
            res.status(500).json({ success: false, error: err.message });
        }
    }
}

module.exports = ProfileRoutes;
