const CartService = require('../../Classes/ServicesClasses/CartService');
const Service = require("../../AbstractClasses/Service.js");
const { CustomerUser: User, Cart, Sale, Product } = require("../../Models/models.js");
const SaleService = require('../../Classes/ServicesClasses/SaleService.js');
const SaleClass = require('../../Classes/Sale.js');
const ProductSaleClass = require('../../Classes/ProductSale.js');
const CartClass = require("../../Classes/Cart.js");

/**
 * Controlador de rutas relacionadas con el carrito de compras.
 * Expone métodos estáticos para cada operación disponible.
 */
class CartRoutes {

    /**
     * Obtiene el carrito actual del usuario.
     * @param {import('express').Request} req
     * @param {import('express').Response} res
     */
    static async getCart(req, res) {
        try {
            const result = await CartService.getCart(req.userId, User, Cart, Service);
            const cartObject = result?.classToObjectForMongo();
            res.status(result ? 200 : 404).json(cartObject || { message: "Carrito no encontrado" });
        } catch (err) {
            res.status(500).json({ success: false, error: err.message });
        }
    }

    /**
     * Agrega un producto al carrito del usuario.
     * @param {import('express').Request} req
     * @param {import('express').Response} res
     */
    static async addToCart(req, res) {
        try {
            const { amount, productId } = req.body;
            const result = await CartService.addToCart(req.userId, productId, amount, User, Cart, Product, CartClass, Service);
            res.status(result ? 200 : 404).json({ message: result ? "Producto agregado al carrito de manera exitosa." : "No se logró agregar el artículo al carrito." });
        } catch (err) {
            res.status(500).json({ success: false, error: err.message });
        }
    }

    /**
     * Actualiza la cantidad de un producto en el carrito.
     * @param {import('express').Request} req
     * @param {import('express').Response} res
     */
    static async updateCartItemAmount(req, res) {
        try {
            const { productId, newAmount } = req.body;
            const result = await CartService.updateCartItemAmount(req.userId, User, Cart, productId, newAmount, Service);
            res.status(result ? 200 : 404).json({ message: result ? "Cambio realizado con éxito." : "No se logró reflejar el cambio en el carrito." });
        } catch (err) {
            res.status(500).json({ success: false, error: err.message });
        }
    }

    /**
     * Elimina un producto del carrito por ID.
     * @param {import('express').Request} req
     * @param {import('express').Response} res
     */
    static async removeCartItem(req, res) {
        try {
            const result = await CartService.removeCartItem(req.userId, req.params.productId, User, Cart, Service);
            res.status(result ? 200 : 404).json({ message: result ? "Eliminación del producto del carrito exitosa." : "No se logró reflejar el cambio en el carrito." });
        } catch (err) {
            res.status(500).json({ success: false, error: err.message });
        }
    }

    /**
     * Realiza la compra de los productos del carrito.
     * @param {import('express').Request} req
     * @param {import('express').Response} res
     */
    static async purchesCart(req, res) {
        try {
            const result = await CartService.purchase(
                req.userId,
                User,
                Cart,
                Service,
                async (cartInstance) => SaleService.createSale(Sale, SaleClass, ProductSaleClass, Service, cartInstance),
                async (saleId) => SaleService.addSaleToUserSales(req.userId, saleId, User, Sale, Service)
            );
            res.status(result ? 200 : 404).json({ message: result ? "Venta realizada con éxito" : "Hubo un error al crear la venta." });
        } catch (err) {
            res.status(500).json({ success: false, error: err.message });
        }
    }

    /**
     * Limpia por completo el carrito del usuario.
     * @param {import('express').Request} req
     * @param {import('express').Response} res
     */
    static async cleanCart(req, res) {
        try {
            const result = await CartService.emptyCart(req.userId, User, Cart, Service);
            res.status(result ? 200 : 404).json({ message: result ? "Carrito limpiado con éxito." : "Hubo un error al limpiar el carrito." });
        } catch (err) {
            res.status(500).json({ success: false, error: err.message });
        }
    }
}

module.exports = CartRoutes;
