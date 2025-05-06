const CustomerUser = require("./CustomerUser");

class AdminUser extends CustomerUser {
    #role;
    #idAdmin;
    /**
     * @param {number} idAdmin
     * @param {number} idUser
     * @param {string} userName
     * @param {string} email
     * @param {string} password
     * @param {string} name
     * @param {Date} registerDate
     * @param {Cart} cart
     * @param {List<Sale>} purchaseHistory
     * @param {Adress} address
     * @param {string} role
     */
    constructor(idAdmin, idUser, name, userName, email, password, registerDate, cart, purchaseHistory, address, role) {
        super(idUser, name, userName, email, password, registerDate, cart, purchaseHistory, address, cart);
        this.idAdmin = idAdmin;
        this.role = role;
    }

    get role() {
        return this.#role;
    }

    set role(role) {
        this.#role = role;
    }

    get idAdmin() {
        return this.#idAdmin;
    }

    set idAdmin(idAdmin) {
        this.#idAdmin = idAdmin;
    }

    classToObjectForMongo() {
        return {
            idAdmin: this.idAdmin,
            role: this.role,
            customerRef: this.idUser,
            userType: 'AdminUser'
        };
    }
}

module.exports = AdminUser;