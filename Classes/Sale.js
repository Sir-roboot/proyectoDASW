class Sale {
    #idSale;
    #date;
    #total;
    #status;
    #products
    /**
     * @param {number} idSale
     * @param {List<Product>} products
     * @param {number} total
     * @param {Date} date
     * @param {string} status
     */

    constructor(idSale, products, total, date, status) {
        this.idSale = idSale;
        this.products = products; 
        this.total = total;
        this.date = date;
        this.status = status;
    }

    set idSale(idSale) {
        this.#idSale = idSale;
    }

    get idSale() {
        return this.#idSale;
    }

    set date(date) {
        this.#date = date;
    }

    get date() {
        return this.#date;
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

    set products(products) {
        this.#products = products;
    }

    get products() {
        return this.#products;
    }

    classToObjectForMongo() {
        return {
            _id: this.idSale,
            products: this.products.map(product => product.classToObjectForMongo()),
            total: this.total,
            date: this.date,
            status: this.status
        };
    }
}

module.exports = Sale;