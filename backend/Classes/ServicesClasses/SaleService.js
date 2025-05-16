/**
 * Servicio para operaciones relacionadas con ventas.
 */
class SaleService {
    /**
     * Crea una nueva venta basada en el contenido de un carrito.
     * @param {Mongoose.Model} saleModel - Modelo de venta de Mongoose.
     * @param {typeof Sale} SaleClass - Clase Sale (lógica de negocio).
     * @param {typeof ProductSale} ProductSaleClass - Clase ProductSale (lógica de negocio).
     * @param {typeof Service} ServiceClass - Clase base de servicios inyectada.
     * @param {CartClass} cartInstance - Instancia de carrito.
     * @returns {Promise<Object>} Venta guardada en la base de datos.
     */
    static async createSale(saleModel, SaleClass, ProductSaleClass, ServiceClass, cartInstance) {
        const saleId = saleModel.getNewId().toString();

        const productSales = cartInstance.items.map(cartItem => {
            const product = cartItem.product;
            return new ProductSaleClass(
                product.idProduct,
                product.name,
                product.brand,
                product.price,
                product.stock,
                product.capacity,
                product.waterproof,
                product.image,
                product.category,
                cartItem.amountToBuy,
                cartItem.priceTotal
            );
        });

        const saleInstance = new SaleClass(
            saleId,
            productSales,
            cartInstance.total,
            new Date(),
            cartInstance.status
        );

        return await ServiceClass.create(saleModel, saleInstance.classToObjectForMongo());
    }

    /**
     * Obtiene una venta específica por su ID.
     * @param {string} saleId - ID de la venta.
     * @param {Mongoose.Model} saleModel - Modelo de venta de Mongoose.
     * @param {typeof Service} ServiceClass - Clase base de servicios inyectada.
     * @returns {Promise<Object|null>} Venta encontrada o null.
     */
    static async getSale(saleId, saleModel, ServiceClass) {
        return await ServiceClass.getById(saleModel, saleId);
    }

    /**
     * Actualiza el estado (status) de una venta.
     * @param {string} saleId - ID de la venta.
     * @param {Mongoose.Model} saleModel - Modelo de venta de Mongoose.
     * @param {string} statusUpdate - Nuevo estado de la venta (ej. "completed", "cancelled").
     * @param {typeof Service} ServiceClass - Clase base de servicios inyectada.
     * @returns {Promise<Object|null>} Venta actualizada o null.
     */
    static async updateSaleStatus(saleId, saleModel, statusUpdate, ServiceClass) {
        return await ServiceClass.updateData(saleModel, saleId, { status: statusUpdate });
    }

    /**
     * Obtiene la lista de ventas (sales) de un usuario.
     * @param {string} userId - ID del usuario.
     * @param {Mongoose.Model} userModel - Modelo de usuario (CustomerUser/AdminUser).
     * @param {typeof Service} ServiceClass - Clase base de servicios inyectada.
     * @returns {Promise<Array<Object>>} Lista de ventas o lista vacía.
     */
    static async getUserSales(userId, userModel, ServiceClass) {
        // Pobla tanto 'sales' como 'cart', si tu lógica requiere convertirlos en clases
        const user = await ServiceClass.getPopulate(userModel, userId, "sales cart");
        if (!user) throw new Error("User not found.");
        // Ya es una instancia reconstruida desde toClassInstance
        return user.purchaseHistory || [];
    }

    /**
     * Agrega una venta al historial de ventas (sales) del usuario.
     * Actualiza únicamente el campo `sales` del documento.
     * @param {string} userId - ID del usuario.
     * @param {string} saleId - ID de la venta nueva.
     * @param {Mongoose.Model} userModel - Modelo de usuario de Mongoose.
     * @param {Mongoose.Model} saleModel - Modelo de venta de Mongoose.
     * @param {typeof Service} ServiceClass - Clase base de servicios inyectada.
     * @returns {Promise<Object|null>} Usuario actualizado o null.
     */
    static async addSaleToUserSales(userId, saleId, userModel, saleModel, ServiceClass) {
        const user = await ServiceClass.getById(userModel, userId);
        if (!user) throw new Error("Usuario no encontrado");

        const saleInstance = await ServiceClass.getById(saleModel, saleId);
        if (!saleInstance) throw new Error("Venta no encontrada");

        const updated = await ServiceClass.updateData(
            userModel,
            { _id: userId },
            { $push: { sales: saleInstance.idSale } }
        );

        if (!updated) throw new Error("No se pudo agregar la venta al historial del usuario");
        return updated;
    }
}

module.exports = SaleService;
