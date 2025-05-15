class CartService {
    /**
     * Obtiene el carrito de un usuario dado su ID.
     * @param {string} userId - ID del usuario (Mongo _id).
     * @param {Mongoose.Model} userModel - Modelo de Mongoose del usuario.
     * @param {Mongoose.Model} cartModel - Model del carrito de compras.
     * @param {typeof Service} ServiceClass - Clase con servcios para hacer los metdso de cada modelo.
     * @returns {Promise<CartClass|null>} Instancia de CartClass o null.
     */
    static async getCart(userId, userModel, cartModel, ServiceClass) {
        const cart = await ServiceClass.getSelectAndPopulate(
            userModel,   // modelo del usuario
            cartModel,   // modelo del que obtendrás la instancia final (Cart)
            userId,      // ID del usuario
            "cart",      // seleccionar solo el campo `cart`
            ["cart"],    // vamos a poblar `cart`
            { cart: undefined }, // (opcional) no queremos seleccionar nada específico dentro de cart
            {
              cart: [ // subpopulate sobre cart
                { 
                    path: "items.product",
                    populate: { path: "category"}
                } 
              ]
            }
        )
        return cart;
    }

    /**
     * Agrega un producto al carrito del usuario.
     * @param {import('mongoose').Mongoose} mongoose
     * @param {string} userId
     * @param {string} productId, 
     * @param {Mongoose.Model} userModel
     * @param {Mongoose.Model} cartModel
     * @param {Mongoose.Model} productModel
     * @param {typeof CartItem} CartItemClass,
     * @param {typeof Service} ServiceClass,
     * @returns {boolean} 
     */
    static async addToCart( userId, productId, userModel, cartModel, productModel, CartItemClass, ServiceClass ) {
        // 1. Cargar el carrito
        const cartInstance = await CartService.getCart(userId, userModel, cartModel, ServiceClass);
        if (!cartInstance) throw new Error('Carrito no encontrado');

        // 2. Buscar si ya existe el ítem
        const cartItem = cartInstance.items.find(
            item => item.product.idProduct === productId
        );

        if (cartItem) {
            cartItem.amountToBuy += 1;
            // Recalcular el precio total del carrito
            cartInstance.calculateTotal();
        } else {
            // 3. Crear nuevo CartItem   
            const productInstance = await ServiceClass.getPopulate(
                productModel,
                productId,
                ['category'],{cartegory: undefined},{Category: undefined}
            );
            if(!productInstance) throw new Error("Producto no encontrado");
            
            const newItem = new CartItemClass(newId, productInstance, 1);
            cartInstance.addItem(newItem);
        }

        // 4. Guardar cambios en Mongo
        return await ServiceClass.updateData(
            cartModel,
            {
                _id: cartInstance.idCart
            },
            {
                $set: {
                    items: cartInstance.items.map(cartItem => cartItem.classToObjectForMongo())
                }
            }
        );
    }

    /**
     * Actualiza la cantidad de un CartItem existente en el carrito.
     * @param {string} userId
     * @param {Mongoose.Model} userModel
     * @param {Mongoose.Model} cartModel
     * @param {string} productId
     * @param {number} newAmount
     * @param {typeof Service} ServiceClass,
     * @returns {boolean}
     */
    static async updateCartItemAmount( userId, userModel, cartModel, productId, newAmount, ServiceClass ) {
        const cartInstance = await CartService.getCart(userId, userModel, cartModel, ServiceClass);
        if (!cartInstance) throw new Error('Carrito no encontrado');

        const cartItem = cartInstance.items.find(
            item => item.product.idProduct === productId
        );
        if (!cartItem) throw new Error('Producto no existe en el carrito');

        // Actualizar la cantidad en la instancia
        cartItem.amountToBuy = newAmount;

        // Recalcular el precio total del carrito
        cartInstance.calculateTotal();

        // Actualizar SOLO el CartItem y el total del carrito en Mongo
        return await this.updateData(
            cartModel,
            {
                _id: cartInstance.idCart,
                "items._id": cartItem.idCartItem
            },
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
     * Elimina un producto del carrito del usuario.
     * @param {string} userId
     * @param {string} productId
     * @param {Mongoose.Model} userModel
     * @param {Mongoose.Model} cartModel
     * @param {typeof Service} ServiceClass
     */
    static async removeCartItem(userId, productId, userModel, cartModel, ServiceClass) {
        const cartInstance = await CartService.getCart(userId, userModel,cartModel,ServiceClass);
        if (!cartInstance) throw new Error('Carrito no encontrado');

        cartInstance.removeItem(productId);
        return await ServiceClass.updateData(
            cartModel,
            {
                _id: cartInstance.idCart
            },
            {
                $pull: { items: { _id: cartItemId } },
                $set: { total: cartInstance.total }
            }
        );
    }

    /**
     * Vacía completamente el carrito del usuario.
     * @param {string} userId
     * @param {Mongoose.Model} userModel
     * @param {Mongoose.Model} cartModel
     * @param {typeof import("../Classes/Cart")} CartClass
     */
    static async emptyCart(userId, userModel, cartModel, ServiceClass) {
        const cartInstance = await CartService.getCart(userId, userModel, cartModel, ServiceClass);
        if (!cartInstance) throw new Error('Carrito no encontrado');
        cartInstance.clearOutCart();
        return await ServiceClass.updateData(
            cartModel,
            {
                _id: cartInstance.idCart 
            },
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
     * Realiza la compra de todos los elementos del carrito del usuario.
     * @param {string} idUser - ID del usuario.
     * @param {Mongoose.Model} userModel - Modelo de usuario.
     * @param {Mongoose.Model} cartModel - Modelo de carrito.
     * @param {Mongoose.Model} saleModel - Modelo de venta.
     * @param {Function} methodGetCart - Función que retorna instancia CartClass.
     * @param {Function} methodEmptyCart - Función para vaciar el carrito.
     * @param {Function} methodCreateSale - Función para crear la venta.
     * @param {Function} methodAddSaleToUser - Función para añadir la venta al usuario.
     * @param {typeof Sale} SaleClass - Clase Sale.
     * @param {typeof ProductSale} ProductSaleClass - Clase ProductSale.
     * @returns {Promise<any>} Resultado de emptyCart o información de la venta.
     */
    static async purchase(
        idUser,
        userModel,
        cartModel,
        ServiceClass,
        methodCreateSale,
        methodAddSaleToUser
    ) {
        const cartInstance = await CartService.getCart(idUser,userModel,cartModel,ServiceClass);
        if (!cartInstance || cartInstance.isEmpty()) {
            throw new Error("Tu carrito está vacío");
        }
        // Crear venta a partir del carrito
        const saleInstance = await methodCreateSale(cartInstance);
        if(!saleInstance) throw new Error("No se pudo crear la venta");
        
        // Agregar venta al historial del usuario
        await methodAddSaleToUser(saleInstance.idSale);
        // Vaciar el carrito y retornar el resultado
        const result = await CartService.emptyCart(idUser,userModel,cartModel,ServiceClass);
        return result;
    }
}

module.exports = CartService;
