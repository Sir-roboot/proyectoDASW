/**
 * Clase que representa un administrador del sistema.
 * Hereda de CustomerUser y agrega un ID exclusivo de administrador.
 */
const CustomerUser = require("./CustomerUser");
const Cart = require("./Cart");
const Sale = require("./Sale");
const Address = require("./Address");

class AdminUser extends CustomerUser {
    #idAdmin;

    /**
     * Constructor de AdminUser
     * @param {string} idAdmin - ID único del administrador
     * @param {string} idUser - ID del usuario base (CustomerUser)
     * @param {string} name
     * @param {string} userName
     * @param {string} email
     * @param {string} password
     * @param {Date} registerDate
     * @param {string} role - Debe ser 'admin'
     * @param {Cart} cart
     * @param {Array<Sale>} purchaseHistory
     * @param {Address} address
     */
    constructor(idAdmin, idUser, name, userName, email, password, registerDate, role, cart, purchaseHistory, address) {
        if (role !== 'admin') {
            throw new TypeError("El rol de un AdminUser debe ser 'admin'.");
        }

        super(idUser, name, userName, email, password, cart, purchaseHistory, address);
        this.registerDate = registerDate;
        this.idAdmin = idAdmin;
    }

    get idAdmin() { return this.#idAdmin; }
    set idAdmin(idAdmin) {
        if (typeof idAdmin !== 'string' || !idAdmin.trim()) {
            throw new TypeError("idAdmin debe ser un string no vacío.");
        }
        this.#idAdmin = idAdmin.trim();
    }

    /**
     * Convierte un objeto plano en una instancia de AdminUser.
     * @param {Object} obj
     * @returns {AdminUser}
     */
    static fromObject(obj) {
        if (!obj || typeof obj !== 'object') {
            throw new TypeError("fromObject espera un objeto válido.");
        }

        const { _id, customerRef } = obj;

        if (!customerRef) {
            throw new Error("Falta el campo 'customerRef' en el documento del admin.");
        }

        const customerInstance = customerRef instanceof CustomerUser
            ? customerRef
            : CustomerUser.fromObject(customerRef);

        return new AdminUser(
            _id?.toString() || 'temp-id',
            customerInstance.idUser,
            customerInstance.name,
            customerInstance.userName,
            customerInstance.email,
            customerInstance.password,
            customerInstance.registerDate,
            customerInstance.role,
            customerInstance.cart,
            customerInstance.purchaseHistory,
            customerInstance.address
        );
    }

    /**
     * Convierte la instancia a un objeto plano listo para MongoDB.
     * @returns {Object}
     */
    classToObjectForMongo() {
        return {
            _id: this.idAdmin,
            customerRef: this.idUser
        };
    }
}

module.exports = AdminUser;
