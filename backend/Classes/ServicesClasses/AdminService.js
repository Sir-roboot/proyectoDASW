/**
 * Servicio para operaciones administrativas sobre usuarios y productos.
 */
class AdminService {
    /**
     * Actualiza campos de un usuario customer.
     * @param {string} customerId - ID del usuario customer
     * @param {Object} updateData - Campos a actualizar (nombre, email, etc.)
     * @param {typeof Service} ServiceClass - Clase base de servicios inyectada
     * @param {typeof CustomerUser} CustomerUserModel - Modelo inyectado de usuario customer
     * @returns {Promise<Object>} Resultado de la operación
     */
    static async updateCustomer(customerId, updateData, ServiceClass, CustomerUserModel) {
        const customer = await ServiceClass.getById(CustomerUserModel, customerId);
        if (!customer) {
            return { success: false, message: "Usuario no encontrado" };
        }
        const updated = await ServiceClass.updateData(CustomerUserModel, customerId, updateData);
        return { success: true, customer: updated };
    }

    /**
     * Elimina un usuario customer del sistema.
     * @param {string} customerId - ID del usuario a eliminar
     * @param {typeof Service} ServiceClass - Clase base de servicios inyectada
     * @param {typeof CustomerUser} CustomerUserModel - Modelo inyectado de usuario customer
     * @returns {Promise<Object>} Resultado de la operación
     */
    static async removeCustomer(customerId, ServiceClass, CustomerUserModel) {
        const customer = await ServiceClass.getById(CustomerUserModel, customerId);
        if (!customer) {
            return { success: false, message: "Usuario no encontrado" };
        }
        const result = await CustomerUserModel.deleteOne({ _id: customerId });
        return { success: true, message: "Usuario eliminado", result };
    }

    /**
     * Agrega un nuevo producto al sistema.
     * @param {Object} productData - Datos del nuevo producto
     * @param {typeof Service} ServiceClass - Clase base de servicios inyectada
     * @param {typeof Product} ProductModel - Modelo inyectado de producto
     * @returns {Promise<Object>} Resultado con el producto creado
     */
    static async addProduct(productData, ServiceClass, ProductModel) {
        const newProduct = await ServiceClass.create(ProductModel, productData);
        return { success: true, product: newProduct };
    }

    /**
     * Actualiza un producto existente.
     * @param {string} productId - ID del producto a actualizar
     * @param {Object} updateData - Campos a modificar
     * @param {typeof Service} ServiceClass - Clase base de servicios inyectada
     * @param {typeof Product} ProductModel - Modelo inyectado de producto
     * @returns {Promise<Object>} Resultado con el producto actualizado
     */
    static async updateProduct(productId, updateData, ServiceClass, ProductModel) {
        const updatedProduct = await ServiceClass.updateData(ProductModel, productId, updateData);
        return { success: true, product: updatedProduct };
    }

    /**
     * Elimina un producto del sistema.
     * @param {string} productId - ID del producto
     * @param {typeof Service} ServiceClass - Clase base de servicios inyectada
     * @param {typeof Product} ProductModel - Modelo inyectado de producto
     * @returns {Promise<Object>} Resultado de la operación
     */
    static async removeProduct(productId, ServiceClass, ProductModel) {
        const product = await ServiceClass.getById(ProductModel, productId);
        if (!product) {
            return { success: false, message: "Producto no encontrado" };
        }
        const deletedProduct = await ProductModel.findByIdAndDelete(productId);
        return { success: true, message: "Producto eliminado", product: deletedProduct };
    }

    /**
     * Obtiene la lista de todos los usuarios customer del sistema.
     * @param {typeof CustomerUser} CustomerUserModel - Modelo inyectado de usuario customer
     * @returns {Promise<Object>} Lista de usuarios
     */
    static async getCustomers(CustomerUserModel) {
        const customers = await CustomerUserModel.find();
        return { success: true, customers };
    }
}

module.exports = AdminService;
