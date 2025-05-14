const Service = require("../AbstractClasses/Service");

class ProductService extends Service {

    /**
     * Crea un nuevo producto a partir de los datos dados
     * @param {Mongoose.Model} model - Modelo de Mongoose
     * @param {Object} data - Datos del producto
     * @returns {Promise<Object>} Instancia de clase Product
     */
    static async createProduct(model, data) {
        return await this.create(model, data);
    }

    /**
     * Obtiene una lista de productos según los filtros dados
     * @param {Mongoose.Model} model - Modelo de Mongoose
     * @param {Object} filters - Filtros por clave/valor (p. ej. categoría, marca)
     * @returns {Promise<Array>} Lista de productos
     */
    static async getProducts(model, filters) {
        const query = {};
        for (const [key, value] of Object.entries(filters)) {
            if (Array.isArray(value)) {
                query[key] = { $in: value };
            } else {
                query[key] = value;
            }
        }
        return await model.find(query).select("name image");
    }

    /**
     * Actualiza un producto existente por su ID
     * @param {string} id - ID del producto
     * @param {Mongoose.Model} model - Modelo de Mongoose
     * @param {Object} dataUpdate - Campos a actualizar
     * @returns {Promise<Object>} Producto actualizado como instancia de clase
     */
    static async updateProduct(id, model, dataUpdate) {
        await model.findByIdAndUpdate(id, dataUpdate);
        const updated = await model.findById(id).lean();
        return model.toClassInstance(updated);
    }

    /**
     * Elimina un producto por su ID
     * @param {string} id - ID del producto
     * @param {Mongoose.Model} model - Modelo de Mongoose
     * @returns {Promise<Object>} Resultado de la operación
     */
    static async deleteProduct(id, model) {
        return await model.findByIdAndDelete(id);
    }

    /**
     * Obtiene los detalles completos de un producto por ID
     * @param {string} id - ID del producto
     * @param {Mongoose.Model} model - Modelo de Mongoose
     * @returns {Promise<Object>} Instancia de clase Product
     */
    static async getProductDetails(id, model) {
        const doc = await model.findById(id).lean();
        return model.toClassInstance(doc);
    }
}

module.exports = ProductService;
