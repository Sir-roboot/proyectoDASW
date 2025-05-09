const bcrypt = require("bcryptjs"); // Para encriptar las contraseñas
const jwt = require("jsonwebtoken"); // Para generar tokens

class AuthService {
    // Método para realizar el login
    static async login(username, password, email, ServiceClass, UserModel, AdminUser) {
        
        let id = undefined;
        let role = undefined;
        let user = undefined;
        // 1. Buscar al usuario
        const customer = await ServiceClass.findByParams(UserModel,{userName: username, email: email});
        if (!customer) {
            return { success: false, message: "Usuario no encontrado" };
        }

        // 2. Verificar si el usuario esta ligado a alguna cuanta de admin
        const admin  = await ServiceClass.findByParams(AdminUser, {customerRef: user.idUser });
        if(admin) {
            id = admin.idAdmin;
            role = admin.role;
            user = admin;
        }
        else {
            id = customer.idUser;
            role = customer.role;
            user = customer;
        }

        // 2. Verificar la contraseña
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return { success: false, message: "Contraseña incorrecta" };
        }
    
        // 3. Generar tokens SIN incluir la contraseña
        const payload = {
            id: id,
            role: role
        };
    
        const accessToken = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '15m' });
        const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' });
    
        // 4. Retornar tokens
    
        return {
            success: true,
            accessToken,
            refreshToken
        };
    }
    

    // Método para registrar un nuevo usuario
    static async register(userData, ServiceClass, UserModel, createUserMethod) {
        // Verificar si ya existe el usuario
        const existingUser = await ServiceClass.findByParams(UserModel, { userName: userData.userName });
        if (existingUser) {
            return { noneExistUser: false, message: "El usuario ya existe" };
        }

        // Encriptar la contraseña
        const hashedPassword = await bcrypt.hash(userData.password, 10);
        userData.password = hashedPassword;
   
        // Crear un nuevo usuario usando el método de la clase CustomerService Service
        await createUserMethod(userData);

        return { noneExistUser:true};
  	}
}

module.exports = AuthService;
