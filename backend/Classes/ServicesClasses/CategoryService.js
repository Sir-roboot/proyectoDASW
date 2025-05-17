class CategoryService {
    
    static async getCategories(modelCatgeory, ServiceClass) {
        return await ServiceClass.findMany(modelCatgeory);
    }
}

module.exports = CategoryService;