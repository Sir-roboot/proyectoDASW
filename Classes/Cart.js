const CartItem = require("./CartItem");

class Cart {
    #idCart;
    #total;
    #items;
    #status;

    /**
     * @param {string} idCart
     * @param {Array<CartItem>} items
     * @param {number} total
     * @param {string} status
     */
    constructor(idCart, items, total, status) {
        this.idCart = idCart;
        this.status = status;
        this.total = total;
        this.items = items || [];
    }

    set idCart(idCart) {
        this.#idCart = idCart;
    }

    get idCart() {
        return this.#idCart;
    }

    set total(total) {
        this.#total = total;
    }

    get total() {
        return this.#total;
    }

    set status(status) {
        this.#status = status;
    }

    get status() {
        return this.#status;
    }

    set items(items) {
        this.#items = items;
    }

    get items() {
        return this.#items;
    }
    
    isEmpty() {
        return !this.items.length;
    }

    /**
     * Agrega un CartItem al carrito.
     * @param {CartItem} cartItem - Instancia de CartItem a agregar.
     */
    addItem(cartItem) {
        this.#items.push(cartItem);
        this.#total += cartItem.priceTotal;
    }

    /**
     * Elimina un CartItem del carrito basado en el id del producto.
     * @param {string} idProduct - ID del producto que quieres eliminar del carrito.
     */
    removeItem(idProduct) {
        const index = this.#items.findIndex(item => item.product.idProduct === idProduct);
        if (index !== -1) {
            const removedItem = this.#items.splice(index, 1)[0]; // eliminar el item
            this.#total -= removedItem.priceTotal; // descontar el precio del total
        }
    }

    calculateNewTotal() {
        const total = this.items.reduce((acc, item) => acc + item.priceTotal, 0);
        this.total = total;
    }

    /**
     * Convierte el carrito a un objeto listo para guardar en MongoDB.
     * @returns {Object} Objeto plano para MongoDB.
     */
    classToObjectForMongo() {
        return {
            _id: this.idCart,
            items: this.items.map(cartItem => cartItem.classToObjectForMongo()),
            total: this.total,
            status: this.status,
        };
    }
}

module.exports = Cart;
