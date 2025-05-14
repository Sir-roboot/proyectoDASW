const Product = require("./AbstractClasses/Product");
const Category = require("./Category");

class ProductSale extends Product {
    #amountToBuy;
    #priceTotal;

    constructor(idProduct, name, brand, price, stock, capacity, waterproof, image, category, amountToBuy, priceTotal) {
        super(idProduct, name, brand, price, stock, capacity, waterproof, image, category);
        this.amountToBuy = amountToBuy;
        this.priceTotal = priceTotal ?? (amountToBuy * price);
    }

    set amountToBuy(value) {
        if (typeof value !== 'number' || value <= 0 || isNaN(value)) {
            throw new TypeError("amountToBuy debe ser un número mayor a 0.");
        }
        this.#amountToBuy = value;
    }

    get amountToBuy() {
        return this.#amountToBuy;
    }

    set priceTotal(value) {
        if (typeof value !== 'number' || value < 0 || isNaN(value)) {
            throw new TypeError("priceTotal debe ser un número válido.");
        }
        this.#priceTotal = value;
    }

    get priceTotal() {
        return this.#priceTotal;
    }

    classToObjectForMongo() {
        const dataProduct = super.classToObjectForMongo();
        const { _id, category, ...productFields } = dataProduct;
        return {
            idProduct: _id,
            ...productFields,
            category: category.classToObjectForMongo(),
            amountBought: this.amountToBuy,
            priceTotal: this.priceTotal
        };
    }

    static fromObject(doc) {
        if (!doc || typeof doc !== 'object') {
            throw new TypeError("fromObject espera un objeto válido.");
        }

        const {
            idProduct,
            name,
            brand,
            price,
            stock,
            capacity,
            waterproof,
            image,
            category,
            amountBought, // <- ¡este es el nuevo nombre!
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
            image,
            categoryInstance,
            amountBought,
            priceTotal
        );
    }
}

module.exports = ProductSale;
