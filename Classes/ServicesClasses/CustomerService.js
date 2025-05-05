const Service = require("../AbstractClasses/Service");

class CustomerService extends Service {
    /**
     * Obtiene el perfil completo de un usuario dado su ID.
     * @param {string} idUser - ID del usuario (Mongo _id).
     * @param {Mongoose.Model} userModel - Modelo de Mongoose del tipo de usuario.
     * @returns {Promise<Object|null>} Instancia del usuario o null si no existe.
     */
    static async getProfile(idUser, userModel) {
        return await this.getById(userModel, idUser);
    }

    /**
     * Actualiza el perfil de un usuario con los datos proporcionados.
     * @param {string} idUser - ID del usuario.
     * @param {Mongoose.Model} userModel - Modelo de Mongoose del tipo de usuario.
     * @param {*} AddressClass - Clase Address con método objectToClass.
     * @param {Object} data - Campos a actualizar.
     * @returns {Promise<Object|null>} Instancia actualizada o null.
     */
    static async updateProfile(idUser, userModel, AddressClass, data) {
        const userInstance = await this.getById(userModel, idUser);
        if (!userInstance) throw new Error("User can't be found.");
        if (data.name) userInstance.name = data.name;
        if (data.userName) userInstance.userName = data.userName;
        if (data.email) userInstance.email = data.email;
        if (data.password) userInstance.password = data.password;
        if (data.address) userInstance.address = AddressClass.objectToClass(data.address);
        const dataUpdate = userInstance.classToObjectForMongo();
        return await this.updateData(userModel, idUser, dataUpdate);
    }

    /**
     * Realiza la compra de todos los elementos del carrito del usuario.
     * @param {string} idUser - ID del usuario.
     * @param {Mongoose.Model} userModel - Modelo de usuario.
     * @param {Mongoose.Model} cartModel - Modelo de carrito.
     * @param {Mongoose.Model} saleModel - Modelo de venta.
     * @param {Function} methodGetCart - Función que retorna instancia CartClass.
     * @param {Function} methodEmptyCart - Función para vaciar el carrito.
     * @param {Function} methodCreateSale - Función para crear la venta.
     * @param {Function} methodAddSaleToUser - Función para añadir la venta al usuario.
     * @param {typeof import('../Classes/Sale')} SaleClass - Clase Sale.
     * @param {typeof import('../Classes/ProductSale')} ProductSaleClass - Clase ProductSale.
     * @returns {Promise<any>} Resultado de emptyCart o información de la venta.
     */
    static async purchase(
        idUser,
        userModel,
        cartModel,
        saleModel,
        methodGetCart,
        methodEmptyCart,
        methodCreateSale,
        methodAddSaleToUser,
        SaleClass,
        ProductSaleClass
    ) {
        const cartInstance = await methodGetCart(idUser, userModel);
        if (!cartInstance || cartInstance.isEmpty()) {
            throw new Error("Tu carrito está vacío");
        }
        // Crear venta a partir del carrito
        const saleInstance = await methodCreateSale(
            saleModel,
            SaleClass,
            ProductSaleClass,
            cartInstance
        );
        // Agregar venta al historial del usuario
        await methodAddSaleToUser(idUser, saleInstance.idSale, userModel);
        // Vaciar el carrito y retornar el resultado
        return await methodEmptyCart(idUser, userModel, cartModel);
    }

    /**
     * Obtiene el historial de compras (IDs) de un usuario.
     * @param {string} idUser - ID del usuario.
     * @param {Mongoose.Model} userModel - Modelo de usuario.
     * @returns {Promise<Object|null>} Objeto con campo `sales` o null.
     */
    static async getPurchaseHistory(idUser, userModel) {
        return await this.getSelect(userModel, idUser, 'sales');
    }
}

module.exports = CustomerService;
