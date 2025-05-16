/**
 * Clase base abstracta para representar un usuario del sistema.
 * No puede instanciarse directamente. Debe heredarse por clases concretas como CustomerUser o AdminUser.
 */
const Address = require("../Classes/Address");

class User {
    #idUser;
    #userName;
    #email;
    #password;
    #name;
    #registerDate;
    #address;

    static REGEX_EMAIL = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    static REGEX_PASSWORD = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;

    /**
     * Constructor base de User (abstracto).
     * @param {string} idUser
     * @param {string} userName
     * @param {string} email
     * @param {string} password
     * @param {string} name
     * @param {Date} registerDate
     * @param {Address} address
     */
    constructor(idUser, userName, email, password, name, registerDate, address = new Address()) {
        if (this.constructor === User) {
            throw new Error("No se puede instanciar directamente la clase abstracta User");
        }

        this.idUser = idUser;
        this.userName = userName;
        this.email = email;
        this.password = password;
        this.name = name;
        this.registerDate = registerDate;
        this.address = address;
    }

    get idUser() { return this.#idUser; }
    set idUser(idUser) {
        if (typeof idUser !== 'string' || !idUser.trim()) {
            throw new TypeError("idUser debe ser un string no vacío.");
        }
        this.#idUser = idUser.trim();
    }

    get userName() { return this.#userName; }
    set userName(userName) {
        if (typeof userName !== 'string' || !userName.trim()) {
            throw new TypeError("userName debe ser un string no vacío.");
        }
        this.#userName = userName.trim();
    }

    get email() { return this.#email; }
    set email(email) {
        if (typeof email !== 'string' || !User.REGEX_EMAIL.test(email)) {
            throw new TypeError("email debe ser un string válido en formato example@hotmail.com");
        }
        this.#email = email.trim();
    }

    get password() { return this.#password; }
    set password(password) {
        if (typeof password !== 'string' || !User.REGEX_PASSWORD.test(password)) {
            throw new TypeError("password debe tener al menos 8 caracteres, una letra y un número. Ejemplo: abcde123");
        }
        this.#password = password;
    }

    get name() { return this.#name; }
    set name(name) {
        if (typeof name !== 'string' || !name.trim()) {
            throw new TypeError("name debe ser un string no vacío.");
        }
        this.#name = name.trim();
    }

    get registerDate() { return this.#registerDate; }
    set registerDate(registerDate) {
        if (!(registerDate instanceof Date) || isNaN(registerDate)) {
            throw new TypeError("registerDate debe ser una fecha válida.");
        }
        this.#registerDate = registerDate;
    }

    get address() { return this.#address; }
    set address(address) {
        if (!(address instanceof Address)) {
            throw new TypeError("address debe ser una instancia válida de Address.");
        }
        this.#address = address;
    }
}

module.exports = User;
