
class Category {
    #idCategory;
    #name;
    #description;
    /**
     * @param {number} idCategory
     * @param {string} name
     * @param {string} description
     */

    constructor(idCategory,name, description) {
        this.idCategory = idCategory;
        this.name = name;
        this.description = description;
    }

    get idCategory() {
        return this.#idCategory;
    }

    set idCategory(idCategory) {
        this.#idCategory = idCategory;
    }

    get name() {
        return this.#name;
    }

    set name(name) {
        this.#name = name;
    }

    get description() {
        return this.#description;
    }

    set description(description){ 
        this.#description = description;
    }

    classToObjectForMongo() {
        return {
            _id: this.idCategory, 
            name: this.name,
            description: this.description
        }
    }
}
module.exports = Category;