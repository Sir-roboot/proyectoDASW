const User = require("./AbstractClasses/User");
const Adress = require("./Address");
const Cart = require("./Cart");
const Sale = require("./Sale");

class CustomerUser extends User {

    #purchaseHistory;
    #cart;

    /**
     * @param {number} idUser
     * @param {string} userName
     * @param {string} email
     * @param {string} password
     * @param {string} name
     * @param {Date} registerDate
     * @param {Adress} address
     * @param {List<Sale>} purchaseHistory
     * @param {Cart} cart
     * 
     */
    constructor(idUser, name, userName, email, password, registerDate, cart, purchaseHistory, address) {
        super(idUser, userName, email, password, name, registerDate, address);
        this.purchaseHistory = purchaseHistory || [];
        this.cart = cart || null;
    }

    set purchaseHistory (purchaseHistory){
        this.#purchaseHistory = purchaseHistory;
    }

    get purchaseHistory() {
        return this.#purchaseHistory;
    }

    set cart(cart) {
        this.#cart = cart;
    }

    get cart() {
        return this.#cart;
    }

    classToObjectForMongo() {
        return {
            _id: this.idUser,
            name: this.name,
            userName: this.userName,
            email: this.email,
            password: this.password,
            registerDate: this.registerDate,
            cart: this.cart ? this.cart.toObjectForMongo() : {},
            sales: this.purchaseHistory.map(sale => sale.idSale),
            address: this.address ? this.address.toObjectForMongo() : undefined,
            userType: 'CustomerUser'
        };
    }
      
}

module.exports = CustomerUser;