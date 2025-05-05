const AuthService = require('../../Classes//ServicesClasses/AuthService');

class AuthRoutes {
    
    static async register(req, res) {
        try {
            const result = await AuthService.register(req.body);
            res.status(result.success ? 201 : 400).json(result);
        } catch (err) {
        res.status(500).json({ success: false, error: err.message });
        }
    }

    static async login(req, res) {
        try {
            const { username, password } = req.body;
            const result = await AuthService.login(username, password);
            res.status(result.success ? 200 : 401).json(result);
        } catch (err) {
            res.status(500).json({ success: false, error: err.message });
        }
    }
}

module.exports = AuthRoutes;
