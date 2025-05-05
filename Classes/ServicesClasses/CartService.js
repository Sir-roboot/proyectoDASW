const Service = require("../AbstractClasses/Service");

class CartService extends Service {
    /**
     * Obtiene el carrito de un usuario dado su ID.
     * @param {string} userId - ID del usuario (Mongo _id).
     * @param {Mongoose.Model} userModel - Modelo de Mongoose del usuario.
     * @returns {Promise<CartClass|null>} Instancia de CartClass o null.
     */
    static async getCart(userId, userModel) {
        const user = await this.getSelectAndPopulate(
            userModel,
            userId,
            'cart',
            ['cart.items.product', 'cart.items.product.category'],
            ['', 'name description']
        );
        return user ? user.cart : null;
    }

    /**
     * Agrega un producto al carrito del usuario.
     * @param {import('mongoose').Mongoose} mongoose
     * @param {string} userId
     * @param {string} productId
     * @param {Mongoose.Model} userModel
     * @param {Mongoose.Model} cartModel
     * @param {Mongoose.Model} productModel
     * @param {typeof import("../Classes/CartItem")} CartItemClass
     */
    static async addToCart(
        mongoose,
        userId,
        productId,
        userModel,
        cartModel,
        productModel,
        CartItemClass
    ) {
        // 1. Cargar el carrito
        const cartInstance = await this.getCart(userId, userModel);
        if (!cartInstance) throw new Error('Usuario o carrito no encontrado');

        // 2. Buscar si ya existe el ítem
        const existingItem = cartInstance.items.find(
            item => item.product.idProduct === productId
        );

        if (existingItem) {
            existingItem.amountToBuy += 1;
            // Recalcular total
            if (typeof cartInstance.calculateNewTotal === 'function') {
                cartInstance.calculateNewTotal();
            } else {
                cartInstance.total = cartInstance.items.reduce(
                    (sum, i) => sum + i.priceTotal,
                    0
                );
            }
        } else {
            // 3. Crear nuevo CartItem
            const newId = await this.getNewId(mongoose);
            const productInstance = await this.getPopulate(
                productModel,
                productId,
                'category'
            );
            const newItem = new CartItemClass(newId, productInstance, 1);
            cartInstance.addItem(newItem);
        }

        // 4. Guardar cambios en Mongo
        return await this.updateData(
            cartModel,
            cartInstance.idCart,
            cartInstance.classToObjectForMongo()
        );
    }

    /**
     * Actualiza la cantidad de un CartItem existente en el carrito.
     * @param {string} userId
     * @param {Mongoose.Model} userModel
     * @param {Mongoose.Model} cartModel
     * @param {string} productId
     * @param {number} newAmount
     */
    static async updateCartItem(
        userId,
        userModel,
        cartModel,
        productId,
        newAmount
    ) {
        const cartInstance = await this.getCart(userId, userModel);
        if (!cartInstance) throw new Error('Carrito no encontrado');

        const cartItem = cartInstance.items.find(
            item => item.product.idProduct === productId
        );
        if (!cartItem) throw new Error('Producto no existe en el carrito');

        cartItem.amountToBuy = newAmount;
        // Recalcular total
        if (typeof cartInstance.calculateNewTotal === 'function') {
            cartInstance.calculateNewTotal();
        } else {
            cartInstance.total = cartInstance.items.reduce(
                (sum, i) => sum + i.priceTotal,
                0
            );
        }

        return await this.updateData(
            cartModel,
            cartInstance.idCart,
            cartInstance.classToObjectForMongo()
        );
    }

    /**
     * Elimina un producto del carrito del usuario.
     * @param {string} userId
     * @param {Mongoose.Model} userModel
     * @param {Mongoose.Model} cartModel
     * @param {string} productId
     */
    static async removeCartItem(userId, userModel, cartModel, productId) {
        const cartInstance = await this.getCart(userId, userModel);
        if (!cartInstance) throw new Error('Carrito no encontrado');

        cartInstance.removeItem(productId);
        return await this.updateData(
            cartModel,
            cartInstance.idCart,
            cartInstance.classToObjectForMongo()
        );
    }

    /**
     * Vacía completamente el carrito del usuario.
     * @param {string} userId
     * @param {Mongoose.Model} userModel
     * @param {Mongoose.Model} cartModel
     * @param {typeof import("../Classes/Cart")} CartClass
     */
    static async emptyCart(userId, userModel, cartModel, CartClass) {
        const cartInstance = await this.getCart(userId, userModel);
        if (!cartInstance) throw new Error('Carrito no encontrado');

        const empty = new CartClass(cartInstance.idCart, [], 0, 'empty');
        return await this.updateData(
            cartModel,
            cartInstance.idCart,
            empty.classToObjectForMongo()
        );
    }
}

module.exports = CartService;
