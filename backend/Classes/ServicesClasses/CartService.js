/**
 * Servicio de carrito de compras, centraliza la lógica de negocio relacionada al carrito
 * y delega persistencia a Service.js y a las clases de dominio como Cart, CartItem, etc.
 */
class CartService {

    /**
     * Obtiene el carrito de un usuario por su ID.
     * @param {string} userId
     * @param {Mongoose.Model} userModel
     * @param {Mongoose.Model} cartModel
     * @param {typeof Service} ServiceClass
     * @returns {Promise<CartClass|null>}
     */
    static async getCart(userId, userModel, cartModel, ServiceClass) {
        return await ServiceClass.getSelectAndPopulate(
            userModel,
            cartModel,
            userId,
            "cart",
            ["cart"],
            { cart: undefined },
            {
                cart: [
                    {
                        path: "items.product",
                        populate: { path: "category" }
                    }
                ]
            }
        );
    }

    /**
     * Agrega un producto al carrito del usuario.
     * @param {string} userId
     * @param {string} productId
     * @param {number} amount
     * @param {Mongoose.Model} userModel
     * @param {Mongoose.Model} cartModel
     * @param {Mongoose.Model} productModel
     * @param {typeof CartItem} CartItemClass
     * @param {typeof Service} ServiceClass
     * @returns {Promise<boolean>}
     */
    static async addToCart(userId, productId, amount, userModel, cartModel, productModel, CartItemClass, ServiceClass) {
        const cartInstance = await CartService.getCart(userId, userModel, cartModel, ServiceClass);
        if (!cartInstance) throw new Error('Carrito no encontrado');

        const cartItem = cartInstance.items.find(item => item.product.idProduct === productId);

        if (cartItem) {
            cartItem.amountToBuy += amount;
            cartInstance.calculateTotal();
        } else {
            const productInstance = await ServiceClass.getPopulate(
                productModel,
                productId,
                ['category']
            );
            if (!productInstance) throw new Error("Producto no encontrado");

            const newItem = new CartItemClass(ServiceClass.normalizeMongoDoc(productId), productInstance, amount);
            cartInstance.addItem(newItem);
        }

        return await ServiceClass.updateData(
            cartModel,
            { _id: cartInstance.idCart },
            {
                $set: {
                    items: cartInstance.items.map(item => item.classToObjectForMongo())
                }
            }
        );
    }

    /**
     * Actualiza la cantidad de un producto en el carrito.
     * @param {string} userId
     * @param {Mongoose.Model} userModel
     * @param {Mongoose.Model} cartModel
     * @param {string} productId
     * @param {number} newAmount
     * @param {typeof Service} ServiceClass
     * @returns {Promise<boolean>}
     */
    static async updateCartItemAmount(userId, userModel, cartModel, productId, newAmount, ServiceClass) {
        const cartInstance = await CartService.getCart(userId, userModel, cartModel, ServiceClass);
        if (!cartInstance) throw new Error('Carrito no encontrado');

        const cartItem = cartInstance.items.find(item => item.product.idProduct === productId);
        if (!cartItem) throw new Error('Producto no existe en el carrito');

        cartItem.amountToBuy = newAmount;
        cartInstance.calculateTotal();

        return await ServiceClass.updateData(
            cartModel,
            { _id: cartInstance.idCart, "items._id": cartItem.idCartItem },
            {
                $set: {
                    "items.$.amountToBuy": cartItem.amountToBuy,
                    "items.$.priceTotal": cartItem.priceTotal,
                    total: cartInstance.total
                }
            }
        );
    }

    /**
     * Elimina un producto del carrito.
     * @param {string} userId
     * @param {string} productId
     * @param {Mongoose.Model} userModel
     * @param {Mongoose.Model} cartModel
     * @param {typeof Service} ServiceClass
     * @returns {Promise<boolean>}
     */
    static async removeCartItem(userId, productId, userModel, cartModel, ServiceClass) {
        const cartInstance = await CartService.getCart(userId, userModel, cartModel, ServiceClass);
        if (!cartInstance) throw new Error('Carrito no encontrado');

        const itemRemoved = cartInstance.removeItem(productId);
        if (!itemRemoved) throw new Error('Producto no estaba en el carrito');

        return await ServiceClass.updateData(
            cartModel,
            { _id: cartInstance.idCart },
            {
                $pull: { items: { _id: itemRemoved.idCartItem } },
                $set: { total: cartInstance.total }
            }
        );
    }

    /**
     * Vacía el carrito completamente.
     * @param {string} userId
     * @param {Mongoose.Model} userModel
     * @param {Mongoose.Model} cartModel
     * @param {typeof Service} ServiceClass
     * @returns {Promise<boolean>}
     */
    static async emptyCart(userId, userModel, cartModel, ServiceClass) {
        const cartInstance = await CartService.getCart(userId, userModel, cartModel, ServiceClass);
        if (!cartInstance) throw new Error('Carrito no encontrado');

        cartInstance.clearOutCart();

        return await ServiceClass.updateData(
            cartModel,
            { _id: cartInstance.idCart },
            {
                $set: {
                    items: cartInstance.items,
                    total: cartInstance.total,
                    status: cartInstance.status
                }
            }
        );
    }

    /**
     * Procesa la compra completa del carrito.
     * @param {string} idUser
     * @param {Mongoose.Model} userModel
     * @param {Mongoose.Model} cartModel
     * @param {typeof Service} ServiceClass
     * @param {Function} methodCreateSale
     * @param {Function} methodAddSaleToUser
     * @returns {Promise<any>}
     */
    static async purchase(idUser, userModel, cartModel, ServiceClass, methodCreateSale, methodAddSaleToUser) {
        const cartInstance = await CartService.getCart(idUser, userModel, cartModel, ServiceClass);
        if (!cartInstance || cartInstance.isEmpty()) {
            throw new Error("Tu carrito está vacío");
        }

        const saleInstance = await methodCreateSale(cartInstance);
        if (!saleInstance) throw new Error("No se pudo crear la venta");

        await methodAddSaleToUser(saleInstance.idSale);

        return await CartService.emptyCart(idUser, userModel, cartModel, ServiceClass);
    }
}

module.exports = CartService;
