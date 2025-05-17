/**
 * Clase que representa un producto vendido en una venta.
 * Hereda de Product y añade campos de cantidad y precio total.
 */
const Product = require("../AbstractClasses/Product");
const Category = require("./Category");

class ProductSale extends Product {
    #amountToBuy;
    #priceTotal;

    /**
     * Constructor de ProductSale.
     * @param {string} idProduct
     * @param {string} name
     * @param {string} brand
     * @param {number} price
     * @param {number} stock
     * @param {string} capacity
     * @param {boolean} waterproof
     * @param {List<string>} images
     * @param {Category} category
     * @param {number} amountToBuy - Cantidad comprada
     * @param {number} [priceTotal] - Precio total (opcional, se calcula si no se da)
     */
    constructor(idProduct, name, brand, price, stock, capacity, waterproof, images, category, amountToBuy, priceTotal) {
        super(idProduct, name, brand, price, stock, capacity, waterproof, images, category);
        this.amountToBuy = amountToBuy;
        this.priceTotal = priceTotal ?? (amountToBuy * price);
    }

    get amountToBuy() { return this.#amountToBuy; }
    set amountToBuy(value) {
        if (typeof value !== 'number' || value <= 0 || isNaN(value)) {
            throw new TypeError("amountToBuy debe ser un número mayor a 0.");
        }
        this.#amountToBuy = value;
    }

    get priceTotal() { return this.#priceTotal; }
    set priceTotal(value) {
        if (typeof value !== 'number' || value < 0 || isNaN(value)) {
            throw new TypeError("priceTotal debe ser un número válido.");
        }
        this.#priceTotal = value;
    }

    /**
     * Convierte la instancia en un objeto plano para persistencia en MongoDB.
     * @returns {Object}
     */
    classToObjectForMongo() {
        const dataProduct = super.classToObjectForMongo();
        const { _id, category, ...productFields } = dataProduct;
        return {
            _id: _id,
            ...productFields,
            category: category.classToObjectForMongo(),
            amountBought: this.amountToBuy,
            priceTotal: this.priceTotal
        };
    }

    /**
     * Crea una instancia de ProductSale desde un objeto plano.
     * Permite que algunos campos opcionales vengan incompletos.
     * @param {Object} doc
     * @returns {ProductSale}
     */
    static fromObject(doc) {
        if (!doc || typeof doc !== 'object') {
            throw new TypeError("fromObject espera un objeto válido.");
        }

        const {
            idProduct,
            name,
            brand = '',
            price,
            stock = 0,
            capacity = '',
            waterproof = false,
            images = '',
            category,
            amountBought,
            priceTotal
        } = doc;

        if (!idProduct || !name || typeof price !== 'number' || typeof amountBought !== 'number' || !category) {
            throw new Error("Faltan campos requeridos para crear un ProductSale.");
        }

        const categoryInstance = category instanceof Category
            ? category
            : Category.fromObject(category);

        return new ProductSale(
            idProduct.toString(),
            name,
            brand,
            price,
            stock,
            capacity,
            waterproof,
            images,
            categoryInstance,
            amountBought,
            priceTotal
        );
    }
}

module.exports = ProductSale;
