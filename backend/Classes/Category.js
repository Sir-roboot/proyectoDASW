/**
 * Clase que representa una categoría de productos.
 * Contiene identificador, nombre y descripción opcional.
 */
class Category {
    #idCategory;
    #name;
    #description;

    /**
     * Constructor de Category
     * @param {string} idCategory
     * @param {string} name
     * @param {string} [description]
     */
    constructor(idCategory, name, description = '') {
        this.idCategory = idCategory;
        this.name = name;
        this.description = description;
    }

    get idCategory() { return this.#idCategory; }
    set idCategory(idCategory) {
        if (typeof idCategory !== 'string' || !idCategory.trim()) {
            throw new TypeError("idCategory debe ser un string no vacío.");
        }
        this.#idCategory = idCategory.trim();
    }

    get name() { return this.#name; }
    set name(name) {
        if (typeof name !== 'string' || !name.trim()) {
            throw new TypeError("name debe ser un string no vacío.");
        }
        this.#name = name.trim();
    }

    get description() { return this.#description; }
    set description(description) {
        if (description !== undefined && typeof description !== 'string') {
            throw new TypeError("description debe ser un string si se proporciona.");
        }
        this.#description = description?.trim() || '';
    }

    /**
     * Convierte la instancia a un objeto plano para MongoDB.
     * @returns {Object}
     */
    classToObjectForMongo() {
        return {
            _id: this.idCategory,
            name: this.name,
            description: this.description
        };
    }

    /**
     * Crea una instancia de Category desde un objeto plano.
     * @param {Object} obj
     * @returns {Category}
     */
    static fromObject(obj) {
        if (!obj || typeof obj !== 'object') {
            throw new TypeError("fromObject espera un objeto válido.");
        }

        const { _id, name, description = '' } = obj;

        if (!name || typeof name !== 'string') {
            throw new Error("Falta el campo 'name' para crear una categoría.");
        }

        return new Category(_id?.toString() || 'temp-id', name, description);
    }
}

module.exports = Category;
