/**
 * Clase que representa a un usuario cliente dentro del sistema.
 * Hereda de User e incluye historial de compras, carrito y rol fijo.
 */
const User = require("./AbstractClasses/User");
const Address = require("./Address");
const Cart = require("./Cart");
const Sale = require("./Sale");

class CustomerUser extends User {
    #purchaseHistory;
    #cart;
    #role;

    static ROLES = ["customer"];

    /**
     * Constructor de CustomerUser
     * @param {string} idUser
     * @param {string} name
     * @param {string} userName
     * @param {string} email
     * @param {string} password
     * @param {Cart} [cart]
     * @param {Array<Sale>} [purchaseHistory]
     * @param {Address} [address]
     */
    constructor(idUser, name, userName, email, password, cart = new Cart(), purchaseHistory = [], address) {
        const registerDate = new Date();
        super(idUser, userName, email, password, name, registerDate, address);

        this.#role = "customer";
        this.purchaseHistory = purchaseHistory;
        this.cart = cart;
    }

    get role() { return this.#role; }

    get purchaseHistory() { return this.#purchaseHistory; }
    set purchaseHistory(history) {
        if (!Array.isArray(history)) {
            throw new TypeError("purchaseHistory debe ser un array.");
        }
        for (const sale of history) {
            if (!(sale instanceof Sale)) {
                throw new TypeError("Todos los elementos deben ser instancias de Sale.");
            }
        }
        this.#purchaseHistory = history;
    }

    get cart() { return this.#cart; }
    set cart(cart) {
        if (!(cart instanceof Cart)) {
            throw new TypeError("cart debe ser una instancia de Cart.");
        }
        this.#cart = cart;
    }

    /**
     * Convierte un objeto plano en una instancia de CustomerUser.
     * @param {Object} obj
     * @returns {CustomerUser}
     */
    static fromObject(obj) {
        if (!obj || typeof obj !== 'object') {
            throw new TypeError("fromObject espera un objeto válido.");
        }

        const {
            _id,
            name,
            userName,
            email,
            password,
            cart,
            sales,
            address
        } = obj;

        if (!name || !userName || !email || !password) {
            throw new Error("Faltan campos obligatorios para crear un CustomerUser.");
        }

        const cartInstance = cart instanceof Cart ? cart : (cart ? Cart.fromObject(cart) : new Cart());

        const saleInstances = Array.isArray(sales)
            ? sales.map(s => (s instanceof Sale ? s : Sale.fromObject(s)))
            : [];

        const addressInstance = address instanceof Address
            ? address
            : (address ? Address.fromObject(address) : null);

        return new CustomerUser(
            _id?.toString() || undefined,
            name,
            userName,
            email,
            password,
            cartInstance,
            saleInstances,
            addressInstance
        );
    }

    /**
     * Convierte la instancia en un objeto plano compatible con MongoDB.
     * @returns {Object}
     */
    classToObjectForMongo() {
        return {
            _id: this.idUser,
            name: this.name,
            userName: this.userName,
            email: this.email,
            password: this.password,
            registerDate: this.registerDate,
            role: this.role,
            cart: this.cart?.classToObjectForMongo?.() || {},
            sales: this.purchaseHistory.map(sale => sale.idSale),
            address: this.address?.classToObjectForMongo?.()
        };
    }
}

module.exports = CustomerUser;
