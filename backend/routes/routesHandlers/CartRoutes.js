const CartService = require('../../Classes/ServicesClasses/CartService');
const Service = require("../../Classes/AbstractClasses/Service");
const { CustomerUser : User, Cart, Sale } = require("../../Models/models.js");
const SaleService = require('../../Classes/ServicesClasses/SaleService.js');
const SaleClass = require('../../Classes/Sale.js');
const ProductSaleClass = require('../../Classes/ProductSale.js');

class CartRoutes {
    //Listo
    static async getCart(req, res) {
        try {
            const result = await CartService.getCart(req.userId, User, Cart, Service);

            if(!result) {
                return res.status(404).json({ message : "Carrito no encontrado"});
            }

            const cartObject = result.classToObjectForMongo();
            res.status(200).json(cartObject);
        } catch (err) {
            res.status(500).json({ success: false, error: err.message });
        }
    }

    static async addToCart(req, res) {
        try {
            const { productId, amount } = req.body;
            const result = await CartService.addToCart(req.userId, productId, amount);
            res.status(200).json(result);
        } catch (err) {
            res.status(500).json({ success: false, error: err.message });
        }
    }

    static async updateCartItemAmount(req, res) {
        try {
            const { productId, newAmount } = req.body;
            const result = await CartService.updateCartItemAmount(req.params.userId, productId, newAmount);
        res.status(200).json(result);
        } catch (err) {
            res.status(500).json({ success: false, error: err.message });
        }
    }

    static async removeCartItem(req, res) {
        try {
            const result = await CartService.removeCartItem(req.params.userId, req.params.productId);
            res.status(200).json(result);
        } catch (err) {
            res.status(500).json({ success: false, error: err.message });
        }
    }

    //Listo
    static async purchesCart(req, res) {
        try {
            await CartService.purchase(req.userId, User, Cart, Service,
                async (cartInstance) => SaleService.createSale(Sale,SaleClass,ProductSaleClass,Service,cartInstance),
                async (saleId) => SaleService.addSaleToUserSales(req.userId, saleId, User, Sale, Service)
            );
            res.status(200).json(result);
        } catch (err) {
            res.status(500).json({ success: false, error: err.message });
        }
    }
}

module.exports = CartRoutes;