const AuthService = require('../../Classes//ServicesClasses/AuthService');
const Service = require("../../Classes/AbstractClasses/Service");
const { CustomerUser: User, AdminUser} = require('../../Models/models.js');
const CustomerUserClass = require("../../Classes/CustomerUser.js");
const CustomerServiceClass = require("../../Classes/ServicesClasses/CustomerService.js");

class AuthRoutes {
    
    static async register(req, res) {
        try {
            const result = await AuthService.register(req.body, Service, User, async (data) => CustomerServiceClass.createUser(data,User, Service, CustomerUserClass));
            res.status(result.success ? 201 : 400).json(result);
        } catch (err) {
            res.status(500).json({ success: false, error: err.message });
        }
    }

    static async login(req, res) {
        try {
            const { username, password, email } = req.body;
            const result = await AuthService.login(username, password, email, Service, User, AdminUser);
            res.status(result.success ? 200 : 401).json(result);
        } catch (err) {
            res.status(500).json({ success: false, error: err.message });
        }
    }
}

module.exports = AuthRoutes;
