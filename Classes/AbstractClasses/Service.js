class Service {

    constructor(){
        if(this.constructor === Service) {
            throw new Error("You can not create an instance of this class directly");
        }
    }
  
    static async getNewId(mongoose) {
        const id = new mongoose.Types.ObjectId();
        return id;
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
        return model.toClassInstance(populatedDoc); // usar el método estático del modelo
    }
  
    /**
     * Guarda una instancia (ya creada manualmente con `new`) y devuelve instancia de clase.
     * @param {Mongoose.Document} document
     * @returns {Promise<Object>} Instancia de clase
     */
    static async save(document) {
        const saved = await document.save();
        const populatedDoc = await saved.constructor.findById(saved._id).lean();
        return saved.constructor.toClassInstance(populatedDoc);
    }
  
    /**
     * Busca un documento por su ID y devuelve instancia de clase.
     * @param {Mongoose.Model} model 
     * @param {string} id 
     * @returns {Promise<Object|null>} Instancia de clase
     */
    static async getById(model, id) {
        const doc = await model.findById(id).lean();
        return doc ? model.toClassInstance(doc) : null;
    }
  
    /**
     * Actualiza un documento por ID con los datos dados y devuelve instancia de clase.
     * @param {Mongoose.Model} model 
     * @param {string} id 
     * @param {Object} data 
     * @returns {Promise<Object|null>} Instancia de clase
     */
    static async updateData(model, id, data) {
        const updatedDoc = await model.findByIdAndUpdate(id, data, { new: true }).lean();
        return updatedDoc ? model.toClassInstance(updatedDoc) : null;
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
        return doc ? model.toClassInstance(doc) : null;
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
    static async getSelectAndPopulate(model, id, fields, populateFields, selectedFields) {
        if (!Array.isArray(populateFields) || !Array.isArray(selectedFields)) {
                throw new Error("Fields populateFields and selectedFields must be arrays");
        }
        
        const list = [];
        for (let i = 0; i  < populateFields.length; i++) {
            list.push({
                path: populateFields[i],
                select: selectedFields[i] ?? ""
            });
        }
        const doc = await model.findById(id).select(fields).populate(list).lean();
        return doc ? model.toClassInstance(doc) : null;
    }
  
    /**
     * Obtiene documento poblado completo y devuelve instancia de clase.
     * @param {Mongoose.Model} model 
     * @param {string} id 
     * @param {string} populateFields
     * @returns {Promise<Object|null>} Instancia de clase
     */
    static async getPopulate(model, id, populateFields) {
        const doc = await model.findById(id).populate(populateFields).lean();
        return doc ? model.toClassInstance(doc) : null;
    }
}
  
module.exports = Service;
  