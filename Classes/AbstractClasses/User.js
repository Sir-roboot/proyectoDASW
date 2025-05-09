class User {
    #idUser;
    #userName;
    #email;
    #password;
    #name;
    #registerDate;
    #address;

    /**
     * @param {string} idUser
     * @param {string} userName
     * @param {string} email
     * @param {string} password
     * @param {string} name
     * @param {Date} registerDate
     * @param {Address} address
     */
    constructor(idUser, userName, email, password, name, registerDate, address) {
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

    get idUser() {
        return this.#idUser;
    }

    set idUser(idUser) {
        if (typeof idUser !== 'string' || !idUser.trim()) {
            throw new TypeError("idUser debe ser un string no vacío.");
        }
        this.#idUser = idUser.trim();
    }

    get userName() {
        return this.#userName;
    }

    set userName(userName) {
        if (typeof userName !== 'string' || !userName.trim()) {
            throw new TypeError("userName debe ser un string no vacío.");
        }
        this.#userName = userName.trim();
    }

    get email() {
        return this.#email;
    }

    set email(email) {
        if (typeof email !== 'string' || !email.includes('@')) {
            throw new TypeError("email debe ser un string válido con '@'.");
        }
        this.#email = email.trim();
    }

    get password() {
        return this.#password;
    }

    set password(password) {
        if (typeof password !== 'string' || password.length < 6) {
            throw new TypeError("password debe ser un string con al menos 6 caracteres.");
        }
        this.#password = password;
    }

    get name() {
        return this.#name;
    }

    set name(name) {
        if (typeof name !== 'string' || !name.trim()) {
            throw new TypeError("name debe ser un string no vacío.");
        }
        this.#name = name.trim();
    }

    get registerDate() {
        return this.#registerDate;
    }

    set registerDate(registerDate) {
        if (!(registerDate instanceof Date) || isNaN(registerDate)) {
            throw new TypeError("registerDate debe ser una fecha válida.");
        }
        this.#registerDate = registerDate;
    }

    get address() {
        return this.#address;
    }

    set address(address) {
        // La validación puede mejorar si tienes una clase Address con verificación propia
        if (typeof address !== 'object' || address === null) {
            throw new TypeError("address debe ser un objeto Address válido.");
        }
        this.#address = address;
    }
}

module.exports = User;
