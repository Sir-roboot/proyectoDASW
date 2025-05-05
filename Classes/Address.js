class Address {
    #street;
    #city;
    #state;
    #zipCode;
    #country;

    /**
     * @param {string} street
     * @param {string} city
     * @param {string} zipCode
     * @param {string} country
     */

    constructor(street,city,state,zipCode,country) {
        this.street = street;
        this.city = city;
        this.state = state;
        this.zipCode = zipCode;
        this.country =country;
    }

    set street(street) {
        this.#street = street;
    }

    get street() {
        return this.#street;
    }

    set city(city) {
        this.#city = city;
    }

    get city() {
        return this.#city;
    }

    set zipCode(zipCode) {
        this.#zipCode = zipCode;
    }

    get zipCode() {
        return this.#zipCode;
    }

    set state(state) {
        this.#state = state;
    }

    get state() {
        return this.#state;
    }

    set country(country) {
        this.#country = country;
    }

    get country() {
        return this.#country;
    }

    static objectToClass(object) {
        return new Adress(
            object.street, 
            object.city, 
            object.state,
            object.zipCode, 
            object.country
        );
    }

    classToObjectForMongo() {
        return {
            street: this.street,
            city: this.city,
            state: this.state,
            zipCode: this.zipCode,
            country: this.country
        } 
    }
}

module.exports = Address;