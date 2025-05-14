class CustomerService {

    /**
     * 
     * @param {*} userModel
     * @param {*} ServiceClass 
     * @param {*} CustomerUserClass 
     * @param {*} data 
     * @returns 
     */
    static async createUser(data, userModel, ServiceClass, CustomerUserClass) {
        const custoemrInstanceVerified = CustomerUserClass.fromObject(data);
        return await ServiceClass.create(userModel,custoemrInstanceVerified.classToObjectForMongo());
    }

    /**
     * Obtiene el perfil completo de un usuario dado su ID.
     * @param {string} idUser - ID del usuario (Mongo _id).
     * @param {Mongoose.Model} userModel - Modelo de Mongoose del tipo de usuario.
     * @param {Service} ServiceClass 
     * @returns {Promise<Object|null>} Instancia del usuario o null si no existe.
     */
    static async getProfile(idUser, userModel, ServiceClass) {
        return await ServiceClass.getById(userModel, idUser);
    }

    /**
     * Actualiza el perfil de un usuario con los datos proporcionados.
     * @param {string} idUser - ID del usuario.
     * @param {Mongoose.Model} userModel - Modelo de Mongoose del tipo de usuario.
     * @param {*} AddressClass - Clase Address con método objectToClass.
     * @param {Object} data - Campos a actualizar.
     * @returns {Promise<Object|null>} Instancia actualizada o null.
     */
    static async updateProfile(idUser, userModel, ServiceClass, AddressClass, data) {
        const userInstance = await ServiceClass.getById(userModel, idUser);
        if (!userInstance) throw new Error("User can't be found.");
        if (data.name) userInstance.name = data.name;
        if (data.userName) userInstance.userName = data.userName;
        if (data.email) userInstance.email = data.email;
        if (data.password) userInstance.password = data.password;
        if (data.address) userInstance.address = AddressClass.objectToClass(data.address);
        const dataUpdate = userInstance.classToObjectForMongo();
        return await ServiceClass.updateData(userModel, idUser, dataUpdate);
    }

    /**
     * Obtiene el historial de compras (IDs) de un usuario.
     * @param {string} idUser - ID del usuario.
     * @param {Mongoose.Model} userModel - Modelo de usuario.
     * @returns {Promise<Object|null>} Objeto con campo `sales` o null.
     */
    static async getPurchaseHistory(idUser, userModel, ServiceClass) {
        return await ServiceClass.getSelect(userModel, idUser, 'sales');
    }
}

module.exports = CustomerService;
