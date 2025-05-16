// Importa servicios y dependencias necesarias
const AdminService = require('../../Classes/ServicesClasses/AdminService');
const { Product } = require("../../Models/models");
const Service = require("../../AbstractClasses/Service");

/**
 * Controlador para la administración de productos por parte de un administrador.
 * Se encarga de crear, actualizar y eliminar productos usando el servicio AdminService.
 */
class ProductManagementRoutes {

    /**
     * Endpoint para agregar un nuevo producto.
     * @param {Request} req - Solicitud HTTP con los datos del producto en el body.
     * @param {Response} res - Respuesta HTTP.
     */
    static async addProduct(req, res) {
        try {
            // Inyecta el modelo de producto y la clase Service a AdminService
            const result = await AdminService.addProduct(req.body, Service, Product);
            res.status(201).json(result);
        } catch (err) {
            res.status(500).json({ success: false, error: err.message });
        }
    }

    /**
     * Endpoint para actualizar los datos de un producto existente.
     * @param {Request} req - Debe contener el ID del producto en params y los datos a actualizar en el body.
     * @param {Response} res - Respuesta HTTP.
     */
    static async updateProduct(req, res) {
        try {
            // Inyecta el ID, los nuevos datos, Service y modelo Product a AdminService
            const result = await AdminService.updateProduct(
                req.params.id,
                req.body,
                Service,
                Product
            );
            res.status(200).json(result);
        } catch (err) {
            res.status(500).json({ success: false, error: err.message });
        }
    }

    /**
     * Endpoint para eliminar un producto existente.
     * @param {Request} req - Debe contener el ID del producto en params.
     * @param {Response} res - Respuesta HTTP.
     */
    static async removeProduct(req, res) {
        try {
            // Inyecta el ID, Service y modelo Product a AdminService
            const result = await AdminService.removeProduct(
                req.params.id,
                Service,
                Product
            );
            res.status(200).json(result);
        } catch (err) {
            res.status(500).json({ success: false, error: err.message });
        }
    }
}

module.exports = ProductManagementRoutes;
