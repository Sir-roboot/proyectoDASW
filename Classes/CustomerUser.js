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
     * @param {string} idUser
     * @param {string} userName
     * @param {string} email
     * @param {string} password
     * @param {string} name
     * @param {Date} registerDate
     * @param {string} role
     * @param {Cart} cart
     * @param {List<Sale>} purchaseHistory
     * @param {Address} address
     */
    constructor(idUser, name, userName, email, password, registerDate, role, cart, purchaseHistory, address) {
        super(idUser, userName, email, password, name, registerDate, address);
        this.role = role;
        this.purchaseHistory = purchaseHistory || [];
        this.cart = cart || null;
    }

    // Setter de role con validación
    set role(role) {
        if (typeof role !== 'string' || !CustomerUser.ROLES.includes(role)) {
            throw new TypeError(`role debe ser uno de: ${CustomerUser.ROLES.join(', ')}`);
        }
        this.#role = role;
    }

    get role() {
        return this.#role;
    }

    // Setter de purchaseHistory con validación
    set purchaseHistory(purchaseHistory) {
        if (!Array.isArray(purchaseHistory)) {
            throw new TypeError("purchaseHistory debe ser un array.");
        }
        for (const sale of purchaseHistory) {
            if (!(sale instanceof Sale)) {
                throw new TypeError("Todos los elementos de purchaseHistory deben ser instancias de Sale.");
            }
        }
        this.#purchaseHistory = purchaseHistory;
    }

    get purchaseHistory() {
        return this.#purchaseHistory;
    }

    // Setter de cart con validación
    set cart(cart) {
        if (cart !== null && !(cart instanceof Cart)) {
            throw new TypeError("cart debe ser una instancia de Cart o null.");
        }
        this.#cart = cart;
    }

    get cart() {
        return this.#cart;
    }

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
            registerDate,
            role,
            cart,
            sales,
            address
        } = obj;
    
        if (!name || !userName || !email || !password || !role) {
            throw new Error("Faltan campos obligatorios para crear un CustomerUser.");
        }
    
        const cartInstance = cart instanceof Cart ? cart : (cart ? Cart.fromObject(cart) : null);
    
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
            registerDate ? new Date(registerDate) : new Date(),
            role,
            cartInstance,
            saleInstances,
            addressInstance
        );
    }
    
    
    classToObjectForMongo() {
        return {
            _id: this.idUser,
            name: this.name,
            userName: this.userName,
            email: this.email,
            password: this.password,
            registerDate: this.registerDate,
            role: this.role,
            cart: this.cart ? this.cart.toObjectForMongo() : {},
            sales: this.purchaseHistory.map(sale => sale.idSale),
            address: this.address ? this.address.toObjectForMongo() : undefined,
        };
    }
}

module.exports = CustomerUser;
