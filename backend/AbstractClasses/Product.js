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

    constructor(idProduct, name, brand, price, stock, capacity, waterproof, image, category) {
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
        if (typeof idProduct !== 'string' || !idProduct.trim()) {
            throw new TypeError("idProduct debe ser un string no vacío.");
        }
        this.#idProduct = idProduct.trim();
    }

    get idProduct() {
        return this.#idProduct;
    }

    set name(name) {
        if (typeof name !== 'string' || !name.trim()) {
            throw new TypeError("name debe ser un string no vacío.");
        }
        this.#name = name.trim();
    }

    get name() {
        return this.#name;
    }

    set brand(brand) {
        if (brand && typeof brand !== 'string') {
            throw new TypeError("brand debe ser un string.");
        }
        this.#brand = brand?.trim() || '';
    }

    get brand() {
        return this.#brand;
    }

    set price(price) {
        if (typeof price !== 'number' || isNaN(price) || price < 0) {
            throw new TypeError("price debe ser un número mayor o igual a 0.");
        }
        this.#price = price;
    }

    get price() {
        return this.#price;
    }

    set stock(stock) {
        if (typeof stock !== 'number' || !Number.isInteger(stock) || stock < 0) {
            throw new TypeError("stock debe ser un entero mayor o igual a 0.");
        }
        this.#stock = stock;
    }

    get stock() {
        return this.#stock;
    }

    set capacity(capacity) {
        if (capacity && typeof capacity !== 'string') {
            throw new TypeError("capacity debe ser un string.");
        }
        this.#capacity = capacity?.trim() || '';
    }

    get capacity() {
        return this.#capacity;
    }

    set waterproof(waterproof) {
        if (typeof waterproof !== 'boolean') {
            throw new TypeError("waterproof debe ser un booleano.");
        }
        this.#waterproof = waterproof;
    }

    get waterproof() {
        return this.#waterproof;
    }

    set image(image) {
        if (image && typeof image !== 'string') {
            throw new TypeError("image debe ser un string.");
        }
        this.#image = image?.trim() || '';
    }

    get image() {
        return this.#image;
    }

    set category(category) {
        if (!(category instanceof Category)) {
            throw new TypeError("category debe ser una instancia de Category.");
        }
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

    /**
     * Convierte un objeto plano en una instancia de Product.
     * @param {Object} obj
     * @returns {Product}
     */
    static fromObject(obj) {
        if (!obj || typeof obj !== 'object') {
            throw new TypeError("fromObject espera un objeto válido.");
        }

        const {
            _id,
            name,
            brand,
            price,
            stock,
            capacity,
            waterproof,
            image,
            category
        } = obj;

        if (!name || typeof price !== 'number' || typeof stock !== 'number' || category === undefined) {
            throw new Error("Faltan campos obligatorios para crear un Product.");
        }

        const categoryInstance = category instanceof Category
            ? category
            : Category.fromObject(category);

        return new Product(
            _id?.toString() || 'temp-id',
            name,
            brand,
            price,
            stock,
            capacity,
            waterproof,
            image,
            categoryInstance
        );
    }
}

module.exports = Product;
