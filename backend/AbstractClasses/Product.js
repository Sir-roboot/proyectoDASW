const Category = require("../Category");

/**
 * Clase del dominio Product que representa un producto del sistema.
 */
class Product {
    #idProduct;
    #name;
    #brand;
    #price;
    #stock;
    #capacity;
    #waterproof;
    #images;
    #category;

    /**
     * Constructor de Product
     * @param {string} idProduct - ID del producto
     * @param {string} name - Nombre del producto
     * @param {string} brand - Marca
     * @param {number} price - Precio
     * @param {number} stock - Stock disponible
     * @param {string} capacity - Capacidad (opcional)
     * @param {boolean} waterproof - Si es impermeable
     * @param {List<string>} images - URLs de imagenes (opcional)
     * @param {Category} category - Instancia de Category
     */
    constructor(idProduct, name, brand, price, stock, capacity, waterproof, images, category) {
        this.idProduct = idProduct;
        this.name = name;
        this.brand = brand;
        this.price = price;
        this.stock = stock;
        this.capacity = capacity;
        this.waterproof = waterproof;
        this.images = images;
        this.category = category;
    }

    // Getters y Setters ordenados por importancia de uso lógico

    get idProduct() { return this.#idProduct; }
    set idProduct(id) {
        if (typeof id !== 'string' || !id.trim()) {
            throw new TypeError("idProduct debe ser un string no vacío.");
        }
        this.#idProduct = id.trim();
    }

    get name() { return this.#name; }
    set name(name) {
        if (typeof name !== 'string' || !name.trim()) {
            throw new TypeError("name debe ser un string no vacío.");
        }
        this.#name = name.trim();
    }

    get brand() { return this.#brand; }
    set brand(brand) {
        if (brand && typeof brand !== 'string') {
            throw new TypeError("brand debe ser un string.");
        }
        this.#brand = brand?.trim() || '';
    }

    get price() { return this.#price; }
    set price(price) {
        if (typeof price !== 'number' || isNaN(price) || price < 0) {
            throw new TypeError("price debe ser un número mayor o igual a 0.");
        }
        this.#price = price;
    }

    get stock() { return this.#stock; }
    set stock(stock) {
        if (typeof stock !== 'number' || !Number.isInteger(stock) || stock < 0) {
            throw new TypeError("stock debe ser un entero mayor o igual a 0.");
        }
        this.#stock = stock;
    }

    get capacity() { return this.#capacity; }
    set capacity(capacity) {
        if (capacity && typeof capacity !== 'string') {
            throw new TypeError("capacity debe ser un string.");
        }
        this.#capacity = capacity?.trim() || '';
    }

    get waterproof() { return this.#waterproof; }
    set waterproof(waterproof) {
        if (typeof waterproof !== 'boolean') {
            throw new TypeError("waterproof debe ser un booleano.");
        }
        this.#waterproof = waterproof;
    }

    get images() { return this.#images; }
    set images(images) {
        if (!Array.isArray(images)) {
            throw new TypeError("images debe ser un arreglo.");
        }
        for (const item of items) {
            if (!(typeof images === 'string')) {
                throw new TypeError("Todos los elementos de images debe ser un string.");
            }
        }
        this.#images = images;
    }

    get category() { return this.#category; }
    set category(category) {
        if (!(category instanceof Category)) {
            throw new TypeError("category debe ser una instancia de Category.");
        }
        this.#category = category;
    }

    /**
     * Convierte la instancia a un objeto listo para guardar en MongoDB.
     * @returns {Object} Objeto plano
     */
    classToObjectForMongo() {
        return {
            _id: this.idProduct,
            name: this.name,
            brand: this.brand,
            price: this.price,
            stock: this.stock,
            capacity: this.capacity,
            waterproof: this.waterproof,
            images: this.images,
            category: this.category.classToObjectForMongo()
        };
    }

    /**
     * Crea una instancia de Product a partir de un objeto plano.
     * @param {Object} obj - Objeto recibido desde Mongo o frontend
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
            images,
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
            images,
            categoryInstance
        );
    }
}

module.exports = Product;
