const AdminService = require('../services/AdminService');

class UserManagementRoutes {
    static async getUsers(req, res) {
        try {
            const result = await AdminService.getUsers();
            res.status(200).json(result);
        } catch (err) {
            res.status(500).json({ success: false, error: err.message });
        }
    }

    static async getUserById(req, res) {
        try {
            const result = await AdminService.getUserById(req.params.id);
            res.status(result ? 200 : 404).json(result || { message: 'Usuario no encontrado' });
        } catch (err) {
            res.status(500).json({ success: false, error: err.message });
        }
    }

    static async changeUserRole(req, res) {
        try {
            const result = await AdminService.changeUserRole(req.params.id, req.body.role);
            res.status(200).json(result);
        } catch (err) {
            res.status(500).json({ success: false, error: err.message });
        }
    }

    static async removeUser(req, res) {
        try {
            const result = await AdminService.removeUser(req.params.id);
            res.status(200).json(result);
        } catch (err) {
            res.status(500).json({ success: false, error: err.message });
        }
    }
}

module.exports = UserManagementRoutes;
