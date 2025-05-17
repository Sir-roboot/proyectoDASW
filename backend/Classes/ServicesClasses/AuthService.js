/**
 * Servicio de autenticación que maneja login y registro de usuarios.
 */
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

class AuthService {
    /**
     * Autentica a un usuario verificando sus credenciales y generando tokens.
     * @param {string} username - Nombre de usuario
     * @param {string} password - Contraseña en texto plano
     * @param {string} email - Correo electrónico del usuario
     * @param {typeof Service} ServiceClass - Clase de servicios genéricos
     * @param {Mongoose.Model} UserModel - Modelo de Mongoose del usuario
     * @param {Mongoose.Model} AdminUser - Modelo de Mongoose del administrador
     * @returns {Promise<Object>} Objeto con éxito y tokens o mensaje de error
     */
    static async login(username, password, email, ServiceClass, UserModel, AdminUser) {
        let id;
        let role;
        let user;

        // 1. Buscar usuario base (CustomerUser)
        const customer = await ServiceClass.findByParams(UserModel, {
            userName: username,
            email: email
        });
        if (!customer) {
            return { success: false, message: "Usuario no encontrado" };
        }

        // 2. Verificar si también es admin
        const admin = await ServiceClass.findByParams(AdminUser, {
            customerRef: customer.idUser
        });

        if (admin) {
            id = admin.idAdmin;
            role = admin.role;
            user = admin;
        } else {
            id = customer.idUser;
            role = customer.role;
            user = customer;
        }

        // 3. Verificar la contraseña con bcrypt
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return { success: false, message: "Contraseña incorrecta" };
        }

        // 4. Generar tokens JWT
        const payload = { id, role };
        const accessToken = jwt.sign(payload, process.env.ACCESS_SECRET, { expiresIn: '15m' });
        const refreshToken = jwt.sign(payload, process.env.REFRESH_SECRET, { expiresIn: '7d' });

        return {
            success: true,
            accessToken,
            refreshToken
        };
    }

    /**
     * Registra un nuevo usuario cifrando su contraseña y validando duplicados.
     * @param {Object} userData - Datos del nuevo usuario
     * @param {typeof Service} ServiceClass - Clase de servicios genéricos
     * @param {Mongoose.Model} UserModel - Modelo de Mongoose
     * @param {Function} createUserMethod - Método para crear el usuario
     * @returns {Promise<Object>} Resultado del intento de registro
     */
    static async register(userData, ServiceClass, UserModel, createUserMethod) {
        const existingUser = await ServiceClass.findByParams(UserModel, {
            userName: userData.userName
        });

        if (existingUser) {
            return { success: false, message: "El usuario ya existe." };
        }

        // 2. Encriptar contraseña y crear usuario
        userData.password = await bcrypt.hash(userData.password, 10);
        await createUserMethod(userData);

        return { success: true , message: "Usuario creado."};
    }
}

module.exports = AuthService;
