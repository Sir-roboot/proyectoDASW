const Service = require("../AbstractClasses/Service");
const { AdminUser, Product } = require('../../Models/models');

class AdminService extends Service {
  
    // Cambiar rol de un usuario
    static async changeUserRole(userId, newRole) {
        // Usamos getById para buscar al usuario
        const user = await this.getById(AdminUser, userId);  // Buscamos al usuario en AdminUser
        if (!user) {
        return { success: false, message: "Usuario no encontrado" };
        }
        
        // Actualizamos el rol usando el método de la clase base Service
        const updatedUser = await this.updateData(AdminUser, userId, { role: newRole });
        return { success: true, user: updatedUser };
    }

    // Agregar un nuevo producto
    static async addProduct(productData) {
        // Usamos el método create para agregar un producto nuevo
        const newProduct = await this.create(Product, productData);
        return { success: true, product: newProduct };
    }

    // Actualizar un producto existente
    static async updateProduct(productId, updateData) {
        // Usamos el método updateData para actualizar el producto
        const updatedProduct = await this.updateData(Product, productId, updateData);
        return { success: true, product: updatedProduct };
    }

    // Eliminar un producto
    static async removeProduct(productId) {
        // Verificamos si el producto existe
        const product = await this.getById(Product, productId);
        if (!product) {
        return { success: false, message: "Producto no encontrado" };
        }
        
        // Usamos el método findByIdAndDelete para eliminar el producto
        const deletedProduct = await Product.findByIdAndDelete(productId);
        return { success: true, message: "Producto eliminado", product: deletedProduct };
    }

    // Consultar la lista de administradores
    static async getAdmins() {
        // Obtenemos todos los usuarios que son administradores
        const admins = await AdminUser.find(); // Consulta simple sin lógica de negocio compleja
        return { success: true, admins };
    }
}

module.exports = AdminService;
