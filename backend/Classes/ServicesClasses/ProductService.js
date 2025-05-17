/**
 * Servicio estático para operaciones CRUD y consultas especializadas sobre productos.
 */
class ProductService {

    /**
     * Crea un nuevo producto con datos validados y transformados.
     * @param {Mongoose.Model} modelProduct - Modelo Mongoose del producto
     * @param {Object} data - Datos planos para crear el producto
     * @param {Function} ProductClass - Clase del dominio Product
     * @param {typeof Service} ServiceClass - Clase de servicio base para persistencia
     * @returns {Promise<{message: string}>} Mensaje de éxito
     */
    static async createProduct(modelProduct, data, ProductClass, ServiceClass) {
        const newData = { _id: modelProduct.getNewId(), ...data };
        const productInstanceVerified = ProductClass.fromObject(newData);
        const newProductIntance = await ServiceClass.create(
            modelProduct,
            productInstanceVerified.classToObjectForMongo()
        );
        if (!newProductIntance) throw new Error("Error al crear producto.");
        return { message: "Producto creado con éxito." };
    }

    /**
     * Actualiza un producto existente por su ID con nuevos datos.
     * @param {Mongoose.Model} modelProduct - Modelo Mongoose del producto
     * @param {string} idProduct - ID del producto a actualizar
     * @param {Object} dataUpdate - Objeto con campos modificados
     * @param {Function} CategoryClass - Clase del dominio Category
     * @param {typeof Service} ServiceClass - Clase de servicio base para persistencia
     * @returns {Promise<boolean>} true si se actualizó correctamente
     */
    static async updateProduct(modelProduct, idProduct, dataUpdate, CategoryClass, ServiceClass) {
        const productInstance = await ProductService.getProductDetails(idProduct, modelProduct, ServiceClass);
        if (!productInstance) throw new Error("Producto no encontrado.");

        if (dataUpdate.name) productInstance.name = dataUpdate.name;
        if (dataUpdate.brand) productInstance.brand = dataUpdate.brand;
        if (dataUpdate.price) productInstance.price = dataUpdate.price;
        if (dataUpdate.stock) productInstance.stock = dataUpdate.stock;
        if (dataUpdate.capacity) productInstance.capacity = dataUpdate.capacity;
        if (dataUpdate.waterProof) productInstance.waterProof = dataUpdate.waterProof;
        if (dataUpdate.images) productInstance.images = dataUpdate.images;
        if (dataUpdate.category) {
            productInstance.category = CategoryClass.fromObject(dataUpdate.category);
        }

        const data = productInstance.classToObjectForMongo();

        return await ServiceClass.updateData(
            modelProduct,
            { _id: productInstance.idProduct },
            { $set: data }
        );
    }

    /**
     * Elimina un producto dado su ID.
     * @param {Mongoose.Model} modelProduct - Modelo Mongoose del producto
     * @param {string} idProduct - ID del producto
     * @param {typeof Service} ServiceClass - Clase de servicio base
     * @returns {Promise<boolean>} true si fue eliminado correctamente
     */
    static async deleteProduct(modelProduct, idProduct, ServiceClass) {
        return await ServiceClass.deleteById(modelProduct, idProduct);
    }

    /**
     * Obtiene un producto por su ID y lo transforma a objeto plano.
     * @param {string} idProduct - ID del producto
     * @param {Mongoose.Model} modelProduct - Modelo Mongoose del producto
     * @param {typeof Service} ServiceClass - Clase de servicio base
     * @returns {Promise<Object>} Objeto plano del producto
     */
    static async getProductDetails(idProduct, modelProduct, ServiceClass) {
        const doc = await ServiceClass.getById(modelProduct, idProduct);
        return doc.classToObjectForMongo();
    }

    /**
     * Obtiene productos que cumplen con filtros dinámicos enviados como query.
     * @param {Mongoose.Model} modelProduct - Modelo Mongoose del producto
     * @param {Object} filters - Filtros como { brand, minPrice, waterproof }
     * @param {typeof Service} ServiceClass - Clase de servicio base
     * @returns {Promise<Array<Object>>} Lista de productos como instancias de clase
     */
    static async getProducts(modelProduct, filters, ServiceClass) {
        const { page = 1, limit = 6, ...realFilters } = filters;

        const query = {};

        for (const [key, value] of Object.entries(realFilters)) {
            if (Array.isArray(value)) {
                query[key] = { $in: value };
            } else if (value === 'true') {
                query[key] = true;
            } else if (value === 'false') {
                query[key] = false;
            } else if (key === 'minPrice') {
                query.price = {};
                query.price.$gte = Number(value);
            } else if (key === 'maxPrice') {
                query.price = {};
                query.price.$lte = Number(value);
            } else {
                query[key] = value;
            }
        }
        
        const skip = (Number(page) - 1) * Number(limit);

        return await ServiceClass.findMany(modelProduct, query, ['category'], skip , Number(limit));
    }

    static async getPrices(modelProduct, ServiceClass) {
        const min = await ServiceClass.findMany(modelProduct, {}, [], 0, 1, {price : -1});
        const max = await ServiceClass.findMany(modelProduct, {}, [], 0, 1, {price : 1});
        return [min, max];
    }
}

module.exports = ProductService;
