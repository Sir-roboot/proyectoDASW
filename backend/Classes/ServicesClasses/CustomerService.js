/**
 * Servicio de negocio para operaciones sobre usuarios tipo Customer.
 * Todas las operaciones dependen de métodos genéricos de Service (inyección).
 */
class CustomerService {

    /**
     * Crea un nuevo usuario customer en la base de datos.
     * - Garantiza que 'cart' sea una instancia de Cart.
     * - Garantiza que 'purchaseHistory' sea un array vacío.
     * - Usa ServiceClass.create() para guardar el documento en MongoDB.
     * @param {Object} data - Datos planos del usuario (name, userName, email, password, address...).
     * @param {Mongoose.Model} userModel - Modelo mongoose correspondiente a CustomerUser.
     * @param {typeof Service} ServiceClass - Clase base de servicios, con métodos estáticos para persistencia.
     * @param {typeof CustomerUser} CustomerUserClass - Clase lógica CustomerUser, con fromObject.
     * @param {typeof CartClass} CartClass - Clase lógica Cart, con constructor vacío para carrito inicial.
     * @returns {Promise<Object>} Retorna la instancia guardada (normalmente reconstruida por fromObject/toClassInstance).
     */
    static async createUser(data, userModel, cartModel, ServiceClass, CustomerUserClass, CartClass) {
        // Siempre garantizamos estos campos al crear el usuario:
        const newData = {
            _id: userModel.getNewId(),
            ...data,
            cart: new CartClass(cartModel.getNewId(),[],0),           // Carrito vacío al registrar usuario
            purchaseHistory: []              // Historial de compras vacío
        };

        // Reconstruir la instancia validando campos obligatorios
        const customerInstanceVerified = CustomerUserClass.fromObject(newData);

        // Guardar en Mongo usando ServiceClass y devolver la instancia reconstruida
        return await ServiceClass.create(userModel, customerInstanceVerified.classToObjectForMongo());
    }


    /**
     * Obtiene el perfil completo de un usuario dado su ID.
     * @param {string} idUser - ID del usuario (Mongo _id).
     * @param {Mongoose.Model} userModel - Modelo de Mongoose del tipo de usuario.
     * @param {typeof Service} ServiceClass - Clase base de servicios, con métodos estáticos para consultas.
     * @returns {Promise<Object|null>} Instancia reconstruida del usuario, o null si no existe.
     */
    static async getProfile(idUser, userModel, ServiceClass) {
        // Devuelve instancia (no doc plano), o null si no existe
        return await ServiceClass.getById(userModel, idUser);
    }

    /**
     * Actualiza el perfil de un usuario con los datos proporcionados.
     * - Aplica los cambios sobre la instancia lógica, la convierte a objeto para Mongo, y guarda.
     * @param {string} idUser - ID del usuario.
     * @param {Mongoose.Model} userModel - Modelo de Mongoose del tipo de usuario.
     * @param {typeof Service} ServiceClass - Clase base de servicios.
     * @param {typeof Address} AddressClass - Clase lógica Address, con fromObject.
     * @param {Object} data - Campos a actualizar (pueden ser name, userName, email, password, address).
     * @returns {Promise<Object|null>} Instancia actualizada o null si no existe.
     */
    static async updateProfile(idUser, userModel, ServiceClass, AddressClass, data) {
        // Obtiene instancia reconstruida (no doc plano)
        const userInstance = await ServiceClass.getById(userModel, idUser);
        if (!userInstance) throw new Error("User can't be found.");
        // Aplica cambios solo a los campos recibidos
        if (data.name) userInstance.name = data.name;
        if (data.userName) userInstance.userName = data.userName;
        if (data.email) userInstance.email = data.email;
        if (data.password) userInstance.password = data.password;
        if (data.address) userInstance.address = AddressClass.fromObject(data.address);
        // Actualiza documento en Mongo
        const dataUpdate = userInstance.classToObjectForMongo();
        // Devuelve el resultado de updateData, normalmente true/false o el doc actualizado
        return await ServiceClass.updateData(userModel, idUser, dataUpdate);
    }

    /**
     * Obtiene el historial de compras (sales IDs) de un usuario.
     * @param {string} idUser - ID del usuario.
     * @param {Mongoose.Model} userModel - Modelo de usuario.
     * @param {typeof Service} ServiceClass - Clase base de servicios.
     * @returns {Promise<Object|null>} Objeto con campo `sales` o null.
     */
    static async getPurchaseHistory(idUser, userModel, ServiceClass) {
        // Solo selecciona el campo 'sales' (IDs, no objetos completos)
        return await ServiceClass.getSelect(userModel, idUser, 'sales');
    }
}

module.exports = CustomerService;
