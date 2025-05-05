const Product = require("./AbstractClasses/Product");
const Category = require("./Category");

class ProductSale extends Product{
    #amountToBuy
    #priceTotal

    /**
     * @param {number} idProduct
     * @param {string} name
     * @param {string} brand
     * @param {number} price
     * @param {number} stock
     * @param {number} capacity
     * @param {boolean} waterproof
     * @param {string} image
     * @param {Category} category
     * @param {number} amountToBuy
     * @param {number} priceTotal
     */

    constructor(idProduct, name, brand, price, stock, capacity, waterproof, image, category, amountToBuy, priceTotal) {
        super(idProduct,name,brand,price,stock,capacity,waterproof,image,category);
        this.amountToBuy = amountToBuy;
        this.priceTotal = priceTotal;
    }

    set priceTotal(priceTotal) {
        this.#priceTotal = priceTotal;
    }

    get priceTotal() {
        return this.#priceTotal;
    }

    set amountToBuy(amountToBuy) {
        this.#amountToBuy = amountToBuy;
        this.priceTotal = amountToBuy*this.price;
    }

    get amountToBuy() {
        return this.#amountToBuy;
    }

    classToObjectForMongo() {
        const dataProduct = super.classToObjectForMongo();
        const { _id, category, ...productFields } = dataProduct;
        return {
            idProduct: _id,
            ...productFields,
            category: category.name,
            amountToBuy: this.amountToBuy,
            priceTotal: this.priceTotal
        };
    }
}

module.exports = ProductSale;