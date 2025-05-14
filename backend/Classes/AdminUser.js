const CustomerUser = require("./CustomerUser");
const Cart = require("./Cart");
const Sale = require("./Sale");
const Address = require("./Address");

class AdminUser extends CustomerUser {
    #idAdmin;

    /**
     * @param {string} idAdmin - ID único del administrador
     * @param {string} idUser - ID del usuario base (CustomerUser)
     * @param {string} name
     * @param {string} userName
     * @param {string} email
     * @param {string} password
     * @param {Date} registerDate
     * @param {string} role - Debe ser 'admin'
     * @param {Cart|null} cart
     * @param {Sale[]} purchaseHistory
     * @param {Address|null} address
     */
    constructor(idAdmin, idUser, name, userName, email, password, registerDate, role, cart, purchaseHistory, address) {
        if (role !== 'admin') {
            throw new TypeError("El rol de un AdminUser debe ser 'admin'.");
        }

        super(idUser, name, userName, email, password, registerDate, role, cart, purchaseHistory, address);
        this.idAdmin = idAdmin;
    }

    get idAdmin() {
        return this.#idAdmin;
    }

    set idAdmin(idAdmin) {
        if (typeof idAdmin !== 'string' || !idAdmin.trim()) {
            throw new TypeError("idAdmin debe ser un string no vacío.");
        }
        this.#idAdmin = idAdmin.trim();
    }

    /**
     * Convierte una representación de objeto plano a una instancia de AdminUser.
     * @param {object} obj
     * @returns {AdminUser}
     */
    static fromObject(obj) {
        if (!obj || typeof obj !== 'object') {
            throw new TypeError("fromObject espera un objeto válido.");
        }

        const {
            _id,               // id del admin (idAdmin)
            customerRef        // debe ser un objeto con todos los datos del usuario base
        } = obj;

        if (!customerRef) {
            throw new Error("Falta el campo 'customerRef' en el documento del admin.");
        }

        const customerInstance = customerRef instanceof CustomerUser
            ? customerRef
            : CustomerUser.fromObject(customerRef);

        return new AdminUser(
            _id?.toString(),
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
     * Convierte la instancia de AdminUser en un objeto plano listo para guardar en MongoDB.
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
