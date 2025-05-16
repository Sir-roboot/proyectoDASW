// Importa la clase de servicio CustomerService (no importa modelos ni lógica aquí)
const CustomerService = require('../../Classes/ServicesClasses/CustomerService');

/**
 * Controlador de rutas para el perfil del usuario.
 * Orquesta las llamadas a CustomerService para obtener, actualizar y consultar historial de compras.
 */
class ProfileRoutes {

    /**
     * Endpoint para obtener el perfil completo de un usuario autenticado.
     * Espera que el middleware de autenticación haya añadido userId a req.
     * @param {Request} req 
     * @param {Response} res 
     */
    static async getProfile(req, res) {
        try {
            // OJO: CustomerService.getProfile debe recibir también userModel y ServiceClass, si sigues la inyección total.
            // Esto solo funciona si internamente CustomerService usa valores hardcodeados, si no, inyecta aquí.
            const result = await CustomerService.getProfile(req.userId);
            res.status(200).json(result);
        } catch (err) {
            res.status(500).json({ success: false, error: err.message });
        }
    }

    /**
     * Endpoint para actualizar el perfil del usuario autenticado.
     * Espera los datos a actualizar en req.body.
     * @param {Request} req 
     * @param {Response} res 
     */
    static async updateProfile(req, res) {
        try {
            // Igualmente, aquí deberías inyectar todos los modelos/clases requeridas
            const result = await CustomerService.updateProfile(req.userId, req.body);
            res.status(200).json(result);
        } catch (err) {
            res.status(500).json({ success: false, error: err.message });
        }
    }

    /**
     * Endpoint para obtener el historial de compras del usuario autenticado.
     * @param {Request} req 
     * @param {Response} res 
     */
    static async getPurchaseHistory(req, res) {
        try {
            // Lo mismo: si tu método requiere inyección de modelos, pásalos aquí.
            const result = await CustomerService.getPurchaseHistory(req.userId);
            res.status(200).json(result);
        } catch (err) {
            res.status(500).json({ success: false, error: err.message });
        }
    }
}

module.exports = ProfileRoutes;
