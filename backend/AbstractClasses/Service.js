/**
 * Clase abstracta de servicios reutilizables para manejar modelos Mongoose
 * con transformación a clases de dominio.
 */
class Service {

    constructor() {
        if (this.constructor === Service) {
            throw new Error("You can not create an instance of this class directly");
        }
    }

    /**
     * Normaliza un documento Mongoose convirtiéndolo a un objeto plano.
     * @param {Mongoose.Document} doc - Documento Mongoose
     * @returns {Object} Objeto plano serializable
     */
    static normalizeMongoDoc(doc) {
        return JSON.parse(JSON.stringify(doc));
    }

    /**
     * Crea configuración para populate con posibles subcampos y selección de campos.
     * @param {Array<string>} paths - Rutas a poblar
     * @param {Object} selects - Campos a seleccionar por cada ruta
     * @param {Object} nestedPopulates - Rutas anidadas
     * @returns {Array<Object>} Configuración para populate
     */
    static createObject(paths, selects = {}, nestedPopulates = {}) {
        return paths.map(path => {
            const entry = {
                path,
                select: selects[path] || undefined
            };

            if (nestedPopulates[path]) {
                entry.populate = nestedPopulates[path];
            }

            return entry;
        });
    }

    /**
     * Crea un nuevo documento y devuelve una instancia de clase.
     * @param {Mongoose.Model} model - Modelo mongoose
     * @param {Object} data - Datos para crear
     * @returns {Promise<Object>} Instancia de clase
     */
    static async create(model, data) {
        const document = await model.create(data);
        const populatedDoc = await model.findById(document._id).lean();
        return model.toClassInstance(Service.normalizeMongoDoc(populatedDoc));
    }

    /**
     * Guarda un documento mongoose ya instanciado.
     * @param {Mongoose.Document} document - Documento mongoose
     * @returns {Promise<Object>} Instancia de clase
     */
    static async save(document) {
        const saved = await document.save();
        const populatedDoc = await saved.constructor.findById(saved._id).lean();
        return saved.constructor.toClassInstance(Service.normalizeMongoDoc(populatedDoc));
    }

    /**
     * Obtiene un documento por ID.
     * @param {Mongoose.Model} model - Modelo mongoose
     * @param {string} id - ID del documento
     * @returns {Promise<Object|null>} Instancia de clase o null
     */
    static async getById(model, id) {
        const doc = await model.findById(id).lean();
        return doc ? model.toClassInstance(Service.normalizeMongoDoc(doc)) : null;
    }

    /**
     * Elimina un documento por ID.
     * @param {Mongoose.Model} model - Modelo mongoose
     * @param {string} id - ID del documento
     * @returns {Promise<boolean>} true si se eliminó, false si no
     */
    static async deleteById(model, id) {
        const result = await model.deleteOne({ _id: id });
        return !!result.deletedCount;
    }

    /**
     * Actualiza un documento por ID.
     * @param {Mongoose.Model} model - Modelo mongoose
     * @param {Object} ids - Filtros (por ejemplo { _id: id })
     * @param {Object} data - Datos a actualizar
     * @returns {Promise<boolean>} true si se actualizó, false si no
     */
    static async updateData(model, ids = {}, data = {}) {
        const result = await model.updateOne(ids, data);
        return result.modifiedCount > 0;
    }

    /**
     * Obtiene un documento por ID con campos seleccionados.
     * @param {Mongoose.Model} model - Modelo mongoose
     * @param {string} id - ID del documento
     * @param {string} fields - Campos a seleccionar
     * @returns {Promise<Object|null>} Instancia de clase o null
     */
    static async getSelect(model, id, fields) {
        const doc = await model.findById(id).select(fields).lean();
        return doc ? model.toClassInstance(Service.normalizeMongoDoc(doc)) : null;
    }

    /**
     * Obtiene un documento por ID con select y populate.
     * @param {Mongoose.Model} modelWhereConsultData - Modelo donde se hace la búsqueda
     * @param {Mongoose.Model} modelTogetInstance - Modelo que tiene toClassInstance()
     * @param {string} id - ID del documento
     * @param {Array<string>} fields - Campos a seleccionar
     * @param {Array<string>} paths - Rutas a poblar
     * @param {Object} selectsFieldsByPath - Campos a seleccionar en populate
     * @param {Object} nestedPopulatesFields - Campos anidados en populate
     * @returns {Promise<Object|null>} Instancia de clase o null
     */
    static async getSelectAndPopulate(
        modelWhereConsultData,
        modelTogetInstance,
        id,
        fields,
        paths,
        selectsFieldsByPath = {},
        nestedPopulatesFields = {}
    ) {
        if (!Array.isArray(paths)) {
            throw new Error("Fields paths must be array");
        }

        const populateParams = Service.createObject(paths, selectsFieldsByPath, nestedPopulatesFields);
        const doc = await modelWhereConsultData.findById(id).select(fields).populate(populateParams).lean();
        return doc ? modelTogetInstance.toClassInstance(Service.normalizeMongoDoc(doc)) : null;
    }

    /**
     * Obtiene un documento por ID y hace populate completo.
     * @param {Mongoose.Model} model - Modelo mongoose
     * @param {string} id - ID del documento
     * @param {Array<string>} paths - Campos a poblar
     * @param {Object} selectsFieldsByPath - Campos a seleccionar en populate
     * @param {Object} nestedPopulatesFields - Campos anidados en populate
     * @returns {Promise<Object|null>} Instancia de clase o null
     */
    static async getPopulate(model, id, paths, selectsFieldsByPath = {}, nestedPopulatesFields = {}) {
        const populateFields = Service.createObject(paths, selectsFieldsByPath, nestedPopulatesFields);
        const doc = await model.findById(id).populate(populateFields).lean();
        return doc ? model.toClassInstance(Service.normalizeMongoDoc(doc)) : null;
    }

    /**
     * Busca un documento con condiciones (findOne).
     * @param {Mongoose.Model} model - Modelo mongoose
     * @param {Object} params - Filtros de búsqueda
     * @returns {Promise<Object|null>} Instancia de clase o null
     */
    static async findByParams(model, params = {}) {
        const doc = await model.findOne(params);
        return doc ? model.toClassInstance(Service.normalizeMongoDoc(doc)) : null;
    }

    /**
     * Busca múltiples documentos de un modelo Mongoose con filtros, populate, paginación y orden opcional.
     * 
     * @param {Mongoose.Model} model - El modelo de Mongoose sobre el que se va a buscar.
     * @param {Object} [params={}] - Objeto con los filtros de búsqueda.
     * @param {Array<string>} [populate=[]] - Lista de campos a poblar (populate) opcionalmente.
     * @param {number} [skip=0] - Número de documentos a saltar (para paginación). Por defecto es 0.
     * @param {number} [limit=0] - Máximo de documentos a regresar (0 = sin límite).
     * @param {Object|null} [sort=null] - Objeto con el criterio de ordenamiento (por ejemplo: { price: 1 } para ascendente).
     * @returns {Promise<Array<Object>>} - Promesa que resuelve a una lista de instancias del modelo (convertidas con toClassInstance).
     */
    static async findMany(model, params = {}, populate = [], skip = 0, limit = 0, sort = null) {
        let query = model.find(params);

        if (sort) query = query.sort(sort);
        if (skip > 0) query = query.skip(skip);
        if (limit > 0) query = query.limit(limit);

        if (populate.length) {
            populate.forEach(path => query = query.populate(path));
        }

        const docList = await query.lean();
        return docList.map(doc => model.toClassInstance(Service.normalizeMongoDoc(doc)));
    }

}

module.exports = Service;
