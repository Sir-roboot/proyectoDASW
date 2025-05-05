
class User {
    #idUser;
    #userName;
    #email;
    #password;
    #name;
    #registerDate;
    #address;
    /**
     * @param {number} idUser
     * @param {string} userName
     * @param {string} email
     * @param {string} password
     * @param {string} name
     * @param {Date} registerDate
     * @param {Adress} address
     */
    constructor(idUser, userName, email, password, name, registerDate, address) {
        if(this.constructor == BaseUser) {
            throw new Error("You can not create an instance of this class directly");
        }
        this.idUser = idUser;
        this.userName = userName;
        this.email = email;
        this.password = password;
        this.name = name;
        this.registerDate = registerDate;
        this.address = address;
    }

    get idUser() {
        return this.#idUser;
    }

    set idUser(idUser) {
        this.#idUser = idUser;
    }

    get userName() {
        return this.#userName;
    }

    set userName(userName) {
        this.#userName = userName;
    }

    get email() {
        return this.#email;
    }

    set email(email) {
        this.#email = email;
    }

    get password() {
        return this.#password;
    }

    set password(password) {
        this.#password = password;
    }

    get name() {
        return this.#name;
    }

    set name(name) {
        this.#name = name;
    }

    get registerDate() {
        return this.#registerDate;
    }

    set registerDate(registerDate) {
        this.#registerDate = registerDate;
    }

    get address() {
        return this.#address;
    }

    set address(address) {
        this.#address = address;
    }

    static objectToClass(object) {
        throw new Error("This method  must be declear");
    }

    classToObjectForMongo() {
        throw new Error("This method  must be declear");
    }
}

module.exports = User;