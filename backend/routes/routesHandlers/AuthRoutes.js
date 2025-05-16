const Service = require("../../AbstractClasses/Service.js");
const { CustomerUser: User, Cart, AdminUser } = require('../../Models/models.js');
const CustomerUserClass = require("../../Classes/CustomerUser.js");
const CustomerServiceClass = require("../../Classes/ServicesClasses/CustomerService.js");
const jwt = require("jsonwebtoken");

/**
 * Rutas de autenticación (registro, login y refresh de token).
 * Orquesta la lógica llamando a AuthService y otros servicios relacionados.
 */
class AuthRoutes {

    /**
     * Endpoint para registrar un nuevo usuario.
     * - Llama a AuthService.register.
     * - Inyecta las dependencias necesarias.
     * - Usa CustomerServiceClass para la creación del usuario.
     */
    static async register(req, res) {
        try {
            const result = await AuthService.register(
                req.body,                // Datos del usuario a registrar
                Service,                 // Clase de servicios generales
                User,                    // Modelo de usuario customer (mongoose)
                async (data) =>          // Método personalizado para crear el usuario
                    CustomerServiceClass.createUser(data, User, Cart, Service, CustomerUserClass)
            );
            res.status(result.success ? 201 : 400).json(result);
        } catch (err) {
            res.status(500).json({ success: false, error: err.message });
        }
    }

    /**
     * Endpoint para login (autenticación de usuario).
     * - Llama a AuthService.login con los argumentos adecuados.
     * - Retorna tokens si el login es exitoso.
     */
    static async login(req, res) {
        try {
            const { username, password, email } = req.body;
            const result = await AuthService.login(
                username,
                password,
                email,
                Service,
                User,        // Modelo de CustomerUser
                AdminUser    // Modelo de AdminUser
            );
            res.status(result.success ? 200 : 401).json(result);
        } catch (err) {
            res.status(500).json({ success: false, error: err.message });
        }
    }

    /**
     * Endpoint para refrescar el token de acceso usando un refresh token válido.
     * - Decodifica el refresh token y emite un nuevo access token.
     */
    static async refreshToken(req, res) {
        try {
            const { refreshToken } = req.body;
            if (!refreshToken)
                return res.status(400).json({ message: 'Token requerido' });

            // Verificar y decodificar el refresh token
            const payload = jwt.verify(refreshToken, process.env.REFRESH_SECRET);
            // Generar un nuevo access token con los datos del payload original
            const newAccessToken = jwt.sign(
                { userId: payload.userId },
                process.env.ACCESS_SECRET,
                { expiresIn: '15m' }
            );
            res.status(200).json({ accessToken: newAccessToken });
        } catch (err) {
            res.status(401).json({ message: 'Token inválido o expirado' });
        }
    }
}

module.exports = AuthRoutes;

