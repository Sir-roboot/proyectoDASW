// Importa la clase base Service para operaciones de datos genéricas
const Service = require('../../AbstractClasses/Service');
// Importa el servicio de administración de usuarios
const AdminService = require('../../Classes/ServicesClasses/AdminService');
// Importa el modelo de usuario (CustomerUser o User, según tu estructura)
const { User } = require("../../Models/models");

/**
 * Controlador para la gestión de usuarios desde el panel de administración.
 * Permite listar, actualizar y eliminar usuarios tipo customer.
 */
class UserManagementRoutes {

    /**
     * Obtiene la lista de todos los usuarios tipo customer.
     * @param {Request} req 
     * @param {Response} res 
     */
    static async getUsers(req, res) {
        try {
            // Llama al servicio de admin para obtener los usuarios
            const result = await AdminService.getCustomers(User);
            res.status(200).json(result);
        } catch (err) {
            res.status(500).json({ success: false, error: err.message });
        }
    }

    /**
     * Actualiza los datos de un usuario customer.
     * Espera en el body el objeto { id, data }.
     * @param {Request} req 
     * @param {Response} res 
     */
    static async updateCustomer(req, res) {
        try {
            const { id, data } = req.body;
            // Llama al servicio de admin para actualizar los datos del usuario
            const result = await AdminService.updateCustomer(id, data, Service, User);
            res.status(result ? 200 : 404).json(result || { message: 'Usuario no encontrado' });
        } catch (err) {
            res.status(500).json({ success: false, error: err.message });
        }
    }

    /**
     * Elimina un usuario customer.
     * Espera el id del usuario en los parámetros de la URL.
     * @param {Request} req 
     * @param {Response} res 
     */
    static async removeUser(req, res) {
        try {
            // Llama al servicio de admin para eliminar el usuario
            const result = await AdminService.removeCustomer(req.params.id, Service, User);
            res.status(200).json(result);
        } catch (err) {
            res.status(500).json({ success: false, error: err.message });
        }
    }
}

module.exports = UserManagementRoutes;
