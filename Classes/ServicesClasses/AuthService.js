const Service = require("../AbstractClasses/Service");
const { CustomerUser: User } = require('../../Models/models'); // Modelo de usuario
const bcrypt = require("bcryptjs"); // Para encriptar las contraseñas
const jwt = require("jsonwebtoken"); // Para generar tokens

class AuthService extends Service {
    // Método para realizar el login
    static async login(username, password) {
        // Buscar el usuario usando el método de la clase base Service
        const user = await this.getById(User, username);
        if (!user) {
            return { success: false, message: "Usuario no encontrado" };
        }

        // Verificar la contraseña
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return { success: false, message: "Contraseña incorrecta" };
        }

        // Generar token si todo es correcto
        const token = jwt.sign({ id: user.id, role: user.role }, 'mysecretkey', { expiresIn: '1h' });
        return { success: true, user, token };
    }

  // Método para registrar un nuevo usuario
    static async register(userData) {
        // Verificar si ya existe el usuario
        const existingUser = await this.getById(User, userData.username);
        if (existingUser) {
            return { success: false, message: "El usuario ya existe" };
        }

        // Encriptar la contraseña
        const hashedPassword = await bcrypt.hash(userData.password, 10);
        userData.password = hashedPassword;

        // Crear un nuevo usuario usando el método de la clase base Service
        const newUser = await this.create(User, userData);

        return { success: true, user: newUser };
  	}
}

module.exports = AuthService;
