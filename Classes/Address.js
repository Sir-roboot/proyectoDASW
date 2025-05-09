class Address {
    #street;
    #city;
    #state;
    #zipCode;
    #country;

    /**
     * @param {string} street
     * @param {string} city
     * @param {string} state
     * @param {string} zipCode
     * @param {string} country
     */
    constructor(street, city, state, zipCode, country) {
        this.street = street;
        this.city = city;
        this.state = state;
        this.zipCode = zipCode;
        this.country = country;
    }

    // Validaciones en setters
    set street(street) {
        if (typeof street !== 'string' || !street.trim()) {
            throw new TypeError("street debe ser un string no vacío.");
        }
        this.#street = street.trim();
    }

    get street() {
        return this.#street;
    }

    set city(city) {
        if (typeof city !== 'string' || !city.trim()) {
            throw new TypeError("city debe ser un string no vacío.");
        }
        this.#city = city.trim();
    }

    get city() {
        return this.#city;
    }

    set state(state) {
        if (typeof state !== 'string' || !state.trim()) {
            throw new TypeError("state debe ser un string no vacío.");
        }
        this.#state = state.trim();
    }

    get state() {
        return this.#state;
    }

    set zipCode(zipCode) {
        if (typeof zipCode !== 'string' || !zipCode.trim()) {
            throw new TypeError("zipCode debe ser un string no vacío.");
        }
        this.#zipCode = zipCode.trim();
    }

    get zipCode() {
        return this.#zipCode;
    }

    set country(country) {
        if (typeof country !== 'string' || !country.trim()) {
            throw new TypeError("country debe ser un string no vacío.");
        }
        this.#country = country.trim();
    }

    get country() {
        return this.#country;
    }

    /**
     * Transforma esta clase a un objeto plano.
     */
    classToObjectForMongo() {
        return {
            street: this.street,
            city: this.city,
            state: this.state,
            zipCode: this.zipCode,
            country: this.country
        };
    }

    /**
     * Convierte un objeto plano en una instancia de Address.
     * @param {Object} obj
     * @returns {Address}
     */
    static fromObject(obj) {
        if (!obj || typeof obj !== 'object') {
            throw new TypeError("fromObject espera un objeto válido.");
        }

        const { street, city, state, zipCode, country } = obj;

        if (!street || !city || !state || !zipCode || !country) {
            throw new Error("Faltan campos obligatorios para crear un Address.");
        }

        return new Address(street, city, state, zipCode, country);
    }
}

module.exports = Address;
