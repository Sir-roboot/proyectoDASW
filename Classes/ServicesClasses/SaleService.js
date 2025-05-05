const Service = require("../AbstractClasses/Service");

class SaleService extends Service {
    
    /**
     * Crea una nueva venta basada en el contenido de un carrito.
     * @param {Mongoose.Model} saleModel - Modelo de venta de Mongoose.
     * @param {typeof Sale} Sale - Clase Sale (lógica de negocio).
     * @param {typeof ProductSale} ProductSale - Clase ProductSale (lógica de negocio).
     * @param {CartClass} cartInstance - Instancia de carrito.
     * @returns {Promise<Object>} Venta guardada en la base de datos.
     */
    static async createSale(saleModel, Sale, ProductSale, cartInstance) {
        const saleInstance = new Sale(
            cartInstance.idCart,
            cartInstance.items.map(cartItem => {
                const product = cartItem.product;
                return new ProductSale(
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
            }),
            new Date(),
            cartInstance.total,
            cartInstance.status
        );
        return await this.create(saleModel, saleInstance.classToObject());
    }

    /**
     * Obtiene una venta específica por su ID.
     * @param {string} saleId - ID de la venta.
     * @param {Mongoose.Model} saleModel - Modelo de venta de Mongoose.
     * @returns {Promise<Object|null>} Venta encontrada o null.
     */
    static async getSale(saleId, saleModel) {
        return await this.getById(saleModel, saleId);
    }

    /**
     * Actualiza el estado (status) de una venta.
     * @param {string} saleId - ID de la venta.
     * @param {Mongoose.Model} saleModel - Modelo de venta de Mongoose.
     * @param {string} statusUpdate - Nuevo estado de la venta (ej. "completed", "cancelled").
     * @returns {Promise<Object|null>} Venta actualizada o null.
     */
    static async updateSaleStatus(saleId, saleModel, statusUpdate) {
        return await this.updateData(saleModel, saleId, { status: statusUpdate });
    }

    /**
     * Obtiene la lista de ventas (sales) de un usuario.
     * @param {string} userId - ID del usuario.
     * @param {Mongoose.Model} userModel - Modelo de usuario (CustomerUser/AdminUser).
     * @returns {Promise<Array<Object>>} Lista de ventas o lista vacía.
     */
    static async getUserSales(userId, userModel) {
        const user = await this.getSelectAndPopulate(
            userModel,
            userId,
            "sales",     // Selecciona solo el campo sales
            ["sales"],   // Poblamos las referencias a sales
            []           // Sin restricciones de campos en sales
        );
        if (!user) throw new Error("User not found.");
        return user.sales || [];
    }

    /**
     * Agrega una venta al historial de ventas (sales) del usuario.
     * Actualiza únicamente el campo `sales` del documento.
     * 
     * @param {string} userId - ID del usuario.
     * @param {string} saleId - ID de la venta nueva.
     * @param {Mongoose.Model} userModel - Modelo de usuario de Mongoose.
     * @param {Mongoose.Model} saleModel - Modelo de venta de Mongoose.
     * @returns {Promise<Object|null>} Usuario actualizado o null.
     */
    static async addSaleToUserSales(userId, saleId, userModel, saleModel) {
        // 1. Obtener las ventas actuales del usuario
        const listSales = await this.getUserSales(userId, userModel);
        
        // 2. Obtener la venta recién creada
        const saleInstance = await this.getSale(saleId, saleModel);
        if (!saleInstance) throw new Error("Sale not found.");

        // 3. Agregar la nueva venta a la lista
        listSales.push(saleInstance);

        // 4. Actualizar solo el campo `sales` en el usuario
        return await this.updateData(userModel, userId, {
            sales: listSales.map(i => i.classToObjectForMongo())
        });
    }
}

module.exports = SaleService;
