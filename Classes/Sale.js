const ProductSale = require('./ProductSale');

class Sale {
    #idSale;
    #date;
    #total;
    #status;
    #products;

    /**
     * @param {string} idSale
     * @param {Array<ProductSale>} products
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
        if (typeof idSale !== 'string' || !idSale.trim()) {
            throw new TypeError("idSale debe ser un string no vacío.");
        }
        this.#idSale = idSale;
    }

    get idSale() {
        return this.#idSale;
    }

    set date(date) {
        const parsed = new Date(date);
        if (isNaN(parsed)) {
            throw new TypeError("date debe ser una instancia válida de Date.");
        }
        this.#date = parsed;
    }

    get date() {
        return this.#date;
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
        if (typeof status !== 'string' || !status.trim()) {
            throw new TypeError("status debe ser un string no vacío.");
        }
        this.#status = status.trim();
    }

    get status() {
        return this.#status;
    }

    set products(products) {
        if (!Array.isArray(products)) {
            throw new TypeError("products debe ser un arreglo.");
        }
        for (const p of products) {
            if (!(p instanceof ProductSale)) {
                throw new TypeError("Todos los elementos de products deben ser instancias de ProductSale.");
            }
        }
        this.#products = products;
    }

    get products() {
        return this.#products;
    }

    /**
     * Convierte esta instancia a un objeto plano para Mongo.
     */
    classToObjectForMongo() {
        return {
            _id: this.idSale,
            products: this.products.map(p => p.classToObjectForMongo()),
            total: this.total,
            date: this.date,
            status: this.status
        };
    }

    /**
     * Crea una instancia de Sale a partir de un objeto plano.
     * @param {Object} obj
     * @returns {Sale}
     */
    static fromObject(obj) {
        if (!obj || typeof obj !== 'object') {
            throw new TypeError("fromObject espera un objeto válido.");
        }

        const {
            _id,
            products,
            total,
            date,
            status
        } = obj;

        if (!products || !total || !date || !status) {
            throw new Error("Faltan campos obligatorios para crear una Sale.");
        }

        const productInstances = products.map(p =>
            p instanceof ProductSale ? p : ProductSale.fromObject(p)
        );

        return new Sale(
            _id?.toString() || undefined,
            productInstances,
            total,
            new Date(date),
            status
        );
    }
}

module.exports = Sale;
