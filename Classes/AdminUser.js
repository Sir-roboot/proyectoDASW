const CustomerUser = require("./CustomerUser");

class AdminUser extends CustomerUser {
    #role;
    /**
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
    constructor(idUser, name, userName, email, password, registerDate, cart, purchaseHistory, address, role) {
        super(idUser, name, userName, email, password, registerDate, cart, purchaseHistory, address, cart);
        this.role = role;
    }

    get role() {
        return this.#role;
    }

    set role(role) {
        this.#role = role;
    }

    classToObjectForMongo() {
        return {
            ...super.classToObjectForMongo(),
            role: this.role,
            userType: 'AdminUser'
        };
    }
}

module.exports = AdminUser;