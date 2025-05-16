/**
 * Clase que representa el carrito de compras de un usuario.
 * Maneja items, total y estado general del carrito.
 */
const CartItem = require("./CartItem");

class Cart {
    #idCart;
    #total;
    #items;
    #status;

    static EMPTY = 'empty';
    static HAS_ITEMS = 'hasItems';

    /**
     * Constructor de Cart
     * @param {string} idCart
     * @param {Array<CartItem>} items
     * @param {number} total
     */
    constructor(idCart, items = [], total = 0) {
        this.idCart = idCart;
        this.items = items;
        this.total = total;
        this.status = items.length ? Cart.HAS_ITEMS : Cart.EMPTY;
    }

    get idCart() { return this.#idCart; }
    set idCart(idCart) {
        if (typeof idCart !== 'string' || !idCart.trim()) {
            throw new TypeError("idCart debe ser un string no vacío.");
        }
        this.#idCart = idCart;
    }

    get total() { return this.#total; }
    set total(total) {
        if (typeof total !== 'number' || isNaN(total) || total < 0) {
            throw new TypeError("total debe ser un número mayor o igual a 0.");
        }
        this.#total = total;
    }

    get status() { return this.#status; }
    set status(status) {
        if (![Cart.EMPTY, Cart.HAS_ITEMS].includes(status)) {
            throw new TypeError(`status debe ser '${Cart.EMPTY}' o '${Cart.HAS_ITEMS}'.`);
        }
        this.#status = status;
    }

    get items() { return this.#items; }
    set items(items) {
        if (!Array.isArray(items)) {
            throw new TypeError("items debe ser un arreglo.");
        }
        for (const item of items) {
            if (!(item instanceof CartItem)) {
                throw new TypeError("Todos los elementos de items deben ser instancias de CartItem.");
            }
        }
        this.#items = items;
    }

    /**
     * Verifica si el carrito está vacío.
     * @returns {boolean}
     */
    isEmpty() {
        return !this.items.length;
    }

    /**
     * Agrega un CartItem al carrito.
     * @param {CartItem} cartItem
     */
    addItem(cartItem) {
        if (!(cartItem instanceof CartItem)) {
            throw new TypeError("cartItem debe ser una instancia de CartItem.");
        }
        this.#items.push(cartItem);
        this.calculateNewTotal();
        this.status = Cart.HAS_ITEMS;
    }

    /**
     * Elimina un item del carrito por ID del producto.
     * @param {string} idProduct
     * @returns {boolean}
     */
    removeItem(idProduct) {
        const index = this.items.findIndex(cartItem => cartItem.product.idProduct === idProduct);
        if (index !== -1) {
            const removedItem = this.items.splice(index, 1)[0];
            this.total = Math.max(0, this.total - removedItem.priceTotal);
            this.status = this.isEmpty() ? Cart.EMPTY : Cart.HAS_ITEMS;
            return removedItem;
        }
        return null;
    }

    /**
     * Recalcula el total del carrito sumando todos los items.
     */
    calculateNewTotal() {
        this.total = this.items.reduce((sum, item) => sum + item.priceTotal, 0);
    }

    /**
     * Vacía el carrito completamente.
     */
    clearOutCart() {
        if (this.status === Cart.EMPTY) {
            throw new Error("El carrito ya está vacío.");
        }
        this.items = [];
        this.total = 0;
        this.status = Cart.EMPTY;
    }

    /**
     * Convierte la instancia a objeto plano compatible con MongoDB.
     * @returns {Object}
     */
    classToObjectForMongo() {
        return {
            _id: this.idCart,
            items: this.items.map(cartItem => cartItem.classToObjectForMongo()),
            total: this.total,
            status: this.status,
        };
    }

    /**
     * Crea una instancia de Cart desde un objeto plano.
     * @param {Object} obj
     * @returns {Cart}
     */
    static fromObject(obj) {
        if (!obj || typeof obj !== 'object') {
            throw new TypeError("fromObject espera un objeto válido.");
        }

        const { _id, items = [], total = 0, status } = obj;

        const itemInstances = items.map(item =>
            item instanceof CartItem ? item : CartItem.fromObject(item)
        );

        const cart = new Cart(
            _id?.toString() || mongoose.Types.ObjectId().toString(),
            itemInstances,
            total
        );

        cart.status = [Cart.EMPTY, Cart.HAS_ITEMS].includes(status)
            ? status
            : cart.isEmpty() ? Cart.EMPTY : Cart.HAS_ITEMS;

        return cart;
    }
}

module.exports = Cart;
