const Category = require("../Category");

class Product {
    #idProduct;
    #name;
    #brand;
    #price;
    #stock;
    #capacity;
    #waterproof;
    #image;
    #category;

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
     */

    constructor(idProduct, name, brand, price, stock, capacity, waterproof, image, category) {
        /*if(this.constructor == Product) {
            throw new Error("You can not create an instance of this class");
        }*/
        this.idProduct = idProduct;
        this.name = name;
        this.brand = brand;
        this.price = price;
        this.stock = stock;
        this.capacity = capacity;
        this.waterproof = waterproof;
        this.image = image;
        this.category = category;
    }

    set idProduct(idProduct) {
        this.#idProduct = idProduct;
    }

    get idProduct() {
        return this.#idProduct;
    }

    set name(name) {
        this.#name = name;
    }

    get name() {
        return this.#name;
    }

    set brand(brand) {
        this.#brand = brand;
    }

    get brand() {
        return this.#brand;
    }

    set price(price) {
        this.#price = price;
    }

    get price() {
        return this.#price;
    }

    set stock(stock) {
        this.#stock = stock;
    }

    get stock() {
        return this.#stock;
    }

    set capacity(capacity) {
        this.#capacity = capacity;
    }

    get capacity() {
        return this.#capacity;
    }

    set waterproof(waterproof) {
        this.#waterproof = waterproof;
    }

    get waterproof() {
        return this.#waterproof;
    }

    set image(image) {
        this.#image = image;
    }

    get image() {
        return this.#image;
    }
    set category(category) {
        this.#category = category;
    }

    get category() {
        return this.#category;
    }

    classToObjectForMongo() {
        return {
            _id: this.idProduct,
            name: this.name,
            brand: this.brand,
            price: this.price,
            stock: this.stock,
            capacity: this.capacity,
            waterproof: this.waterproof,
            image: this.image,
            category: this.category.classToObjectForMongo()
        };
    }
}

module.exports = Product;