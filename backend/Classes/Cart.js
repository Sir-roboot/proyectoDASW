const CartItem = require("./CartItem");

class Cart {
    #idCart;
    #total;
    #items;
    #status;

    static EMPTY = 'empty';
    static HAS_ITEMS = 'hasItems';

    constructor(idCart, items, total) {
        this.idCart = idCart;
        this.status = Cart.EMPTY;
        this.total = total;
        this.items = items || [];
    }

    set idCart(idCart) {
        if (typeof idCart !== 'string' || !idCart.trim()) {
            throw new TypeError("idCart debe ser un string no vacío.");
        }
        this.#idCart = idCart;
    }

    get idCart() {
        return this.#idCart;
    }

    set total(total) {
        if (typeof total !== 'number' || isNaN(total) || total < 0) {
            throw new TypeError("total debe ser un número mayor o igual a 0.");
        }
        this.#total = total;
    }

    get total() {
        return this.#total;
    }

    set status(status) {
        if (![Cart.EMPTY, Cart.HAS_ITEMS].includes(status)) {
            throw new TypeError(`status debe ser '${Cart.EMPTY}' o '${Cart.HAS_ITEMS}'.`);
        }
        this.#status = status;
    }

    get status() {
        return this.#status;
    }

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

    get items() {
        return this.#items;
    }

    isEmpty() {
        return !this.items.length;
    }

    addItem(cartItem) {
        if (!(cartItem instanceof CartItem)) {
            throw new TypeError("cartItem debe ser una instancia de CartItem.");
        }

        if (this.status === Cart.EMPTY) {
            this.status = Cart.HAS_ITEMS;
        }

        this.#items.push(cartItem);
        this.#total += cartItem.priceTotal;
    }

    removeItem(idProduct) {
        const index = this.items.findIndex(cartItem => cartItem.product.idProduct === idProduct);
        if (index !== -1) {
            const removedItem = this.items.splice(index, 1)[0];
            this.#total = Math.max(0, this.#total - removedItem.priceTotal);
            this.status = this.isEmpty() ? Cart.EMPTY : Cart.HAS_ITEMS;
            return true;
        }
        return false;
    }

    calculateNewTotal() {
        const total = this.items.reduce((acc, item) => acc + item.priceTotal, 0);
        this.total = total;
    }

    clearOutCart() {
        if (this.status === Cart.EMPTY) {
            throw new Error("El carrito ya está vacío.");
        }
        this.items = [];
        this.total = 0;
        this.status = Cart.EMPTY;
    }

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

        const { _id, items, total, status } = obj;

        if (!Array.isArray(items) || typeof total !== 'number') {
            throw new Error("items debe ser un arreglo y total un número válido.");
        }

        const itemInstances = items.map(item =>
            item instanceof CartItem ? item : CartItem.fromObject(item)
        );

        const cart = new Cart(
            _id?.toString() || 'temp-id',
            itemInstances,
            total
        );

        if (status && [Cart.EMPTY, Cart.HAS_ITEMS].includes(status)) {
            cart.status = status;
        } else {
            cart.status = cart.isEmpty() ? Cart.EMPTY : Cart.HAS_ITEMS;
        }

        return cart;
    }
}

module.exports = Cart;
