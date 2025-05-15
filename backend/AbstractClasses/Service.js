class Service {

    constructor(){
        if(this.constructor === Service) {
            throw new Error("You can not create an instance of this class directly");
        }
    }
  
    static normalizeMongoDoc(doc) {
        return JSON.parse(JSON.stringify(doc));
    }

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
     * Crea un nuevo documento en el modelo y devuelve instancia de clase.
     * @param {Mongoose.Model} model 
     * @param {Object} data 
     * @returns {Promise<Object>} Instancia de clase
     */
    static async create(model, data) {
        const document = await model.create(data);
        const populatedDoc = await model.findById(document._id).lean(); // obtén documento limpio
        return model.toClassInstance(Service.normalizeMongoDoc(populatedDoc)); // usar el método estático del modelo
    }
  
    /**
     * Guarda una instancia (ya creada manualmente con `new`) y devuelve instancia de clase.
     * @param {Mongoose.Document} document
     * @returns {Promise<Object>} Instancia de clase
     */
    static async save(document) {
        const saved = await document.save();
        const populatedDoc = await saved.constructor.findById(saved._id).lean();
        return saved.constructor.toClassInstance(Service.normalizeMongoDoc(populatedDoc));
    }
  
    /**
     * Busca un documento por su ID y devuelve instancia de clase.
     * @param {Mongoose.Model} model 
     * @param {string} id 
     * @returns {Promise<Object|null>} Instancia de clase
     */
    static async getById(model, id) {
        const doc = await model.findById(id).lean();
        return doc ? model.toClassInstance(Service.normalizeMongoDoc(doc)) : null;
    }
  
    /**
     * Actualiza un documento por ID con los datos dados.
     * Solo devuelve `true` si se actualizó correctamente, o `false` si no se encontró.
     * 
     * @param {Mongoose.Model} model - Modelo Mongoose.
     * @param {Object} ids - IDs de documentos a actualizar.
     * @param {Object} data - Datos a actualizar.
     * @returns {Promise<boolean>} - `true` si se actualizó, `false` si no.
     */
    static async updateData(model, ids = {}, data = {}) {
        const result = await model.updateOne(ids, data );
        return !!result; // true si se actualizó, false si no se encontró
    }

  
    /**
     * Obtiene un documento con campos específicos y devuelve instancia de clase.
     * @param {Mongoose.Model} model 
     * @param {string} id 
     * @param {string} fields
     * @returns {Promise<Object|null>} Instancia de clase
     */
    static async getSelect(model, id, fields) {
        const doc = await model.findById(id).select(fields).lean();
        return doc ? model.toClassInstance(Service.normalizeMongoDoc(doc)) : null;
    }
    

    /**
     * Obtiene documento con campos seleccionados y campos poblados, devuelve instancia de clase.
     * @param {Mongoose.Model} model 
     * @param {string} id 
     * @param {Array<string>} fields
     * @param {Array<string>} populateFields
     * @param {Array<string>} selectedFields
     * @returns {Promise<Object|null>} Instancia de clase
     */
    static async getSelectAndPopulate(modelWhereConsultData, modelTogetInstance, 
                                        id, fields, 
                                        paths, selectsFieldsByPath = {}, nestedPopulatesFields = {}) {
        if (!Array.isArray(paths)) {
                throw new Error("Fields paths must be array");
        }
        
        const populateParams = Service.createObject(paths, selectsFieldsByPath,nestedPopulatesFields);
        const doc = await modelWhereConsultData.findById(id).select(fields).populate(populateParams).lean();
        return doc ? modelTogetInstance.toClassInstance(Service.normalizeMongoDoc(doc)) : null;
    }
  
    /**
     * Obtiene documento poblado completo y devuelve instancia de clase.
     * @param {Mongoose.Model} model 
     * @param {string} id 
     * @param {string} populateFields
     * @returns {Promise<Object|null>} Instancia de clase
     */
    static async getPopulate(model, id, paths, selectsFieldsByPath = {}, nestedPopulatesFields = {}) {
        const populateFields = Service.createObject(paths, selectsFieldsByPath, nestedPopulatesFields);
        const doc = await model.findById(id).populate(populateFields).lean();
        return doc ? model.toClassInstance(Service.normalizeMongoDoc(doc)) : null;
    }

    /**
     * 
     * @param {Mongoose.Model} model 
     * @param {Object} params 
     * @returns 
     */
    static async findByParams(model, params = {}) {
        const doc =  await model.findOne(params);
        return doc? model.toClassInstance(Service.normalizeMongoDoc(doc)) : null;
    }

    /**
     * 
     * @param {Mongoose.Model} model 
     * @param {Object} params 
     * @returns 
     */
    static async findMany(model, params = {}) {
        const docList = await model.find(params);
        const list  = docList.map(doc => model.toClassInstance(Service.normalizeMongoDoc(doc)));
        return list;
    }

}
  
module.exports = Service;
  