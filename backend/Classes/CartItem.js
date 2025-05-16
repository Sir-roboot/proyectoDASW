/**
 * Clase que representa un ítem dentro del carrito de compras.
 * Contiene producto, cantidad y cálculo automático del precio total.
 */
const Product = require("./AbstractClasses/Product");

class CartItem {
    #idCartItem;
    #product;
    #amountToBuy;
    #priceTotal;

    /**
     * Constructor de CartItem
     * @param {string} idCartItem
     * @param {Product} product
     * @param {number} amountToBuy
     */
    constructor(idCartItem, product, amountToBuy) {
        this.idCartItem = idCartItem;
        this.product = product;
        this.amountToBuy = amountToBuy; // set calcula automáticamente el priceTotal
    }

    get idCartItem() { return this.#idCartItem; }
    set idCartItem(value) {
        if (typeof value !== 'string' || !value.trim()) {
            throw new TypeError("idCartItem debe ser un string no vacío.");
        }
        this.#idCartItem = value.trim();
    }

    get product() { return this.#product; }
    set product(value) {
        if (!(value instanceof Product)) {
            throw new TypeError("product debe ser una instancia de Product.");
        }
        this.#product = value;
        this.#priceTotal = this.#product.price * (this.#amountToBuy || 0);
    }

    get amountToBuy() { return this.#amountToBuy; }
    set amountToBuy(value) {
        if (typeof value !== 'number' || value <= 0 || isNaN(value)) {
            throw new TypeError("amountToBuy debe ser un número mayor a 0.");
        }
        this.#amountToBuy = value;
        if (this.#product) {
            this.#priceTotal = this.#product.price * value;
        }
    }

    get priceTotal() { return this.#priceTotal; }

    /**
     * Convierte esta instancia a un objeto plano para MongoDB.
     * @returns {Object}
     */
    classToObjectForMongo() {
        return {
            _id: this.idCartItem,
            product: this.product.idProduct,
            amountToBuy: this.amountToBuy,
            priceTotal: this.priceTotal
        };
    }

    /**
     * Crea una instancia de CartItem desde un objeto plano.
     * @param {Object} obj
     * @returns {CartItem}
     */
    static fromObject(obj) {
        if (!obj || typeof obj !== 'object') {
            throw new TypeError("fromObject espera un objeto válido.");
        }

        const { _id, product, amountToBuy } = obj;

        if (!_id || !product || typeof amountToBuy !== 'number') {
            throw new Error("Faltan campos obligatorios para crear un CartItem.");
        }

        const productInstance = product instanceof Product
            ? product
            : Product.fromObject(product);

        return new CartItem(
            _id.toString(),
            productInstance,
            amountToBuy
        );
    }
}

module.exports = CartItem;
