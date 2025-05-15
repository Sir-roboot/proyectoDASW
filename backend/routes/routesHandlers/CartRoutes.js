const CartService = require('../../Classes/ServicesClasses/CartService');
const Service = require("../../AbstractClasses/Service.js");
const { CustomerUser : User, Cart, Sale, Product} = require("../../Models/models.js");
const SaleService = require('../../Classes/ServicesClasses/SaleService.js');
const SaleClass = require('../../Classes/Sale.js');
const ProductSaleClass = require('../../Classes/ProductSale.js');
const CartClass = require("../../Classes/Cart.js");

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
    
    //Listo
    static async addToCart(req, res) {
        try {
            const { productId } = req.body;
            const result = await CartService.addToCart(req.userId, productId, User, Cart,Product,CartClass,Service);
            if(!result) {
                return result.status(404).json({ message : "No se logro agregar el articulo al carrito."})
            }

            res.status(200).json({ message : "Producto agregado al carrito de manera exitosa."});
        } catch (err) {
            res.status(500).json({ success: false, error: err.message });
        }
    }

    //Listo
    static async updateCartItemAmount(req, res) {
        try {
            const { productId, newAmount } = req.body;
            const result = await CartService.updateCartItemAmount(req.userId, User, Cart, productId, newAmount, Service);
            if(!result) {
                return result.status(404).json({ message : "No se logro reflejar el cambio en el carrito."})
            }

            res.status(200).json({ message : "Cambio realizado con exito."});
        } catch (err) {
            res.status(500).json({ success: false, error: err.message });
        }
    }

    //Listo
    static async removeCartItem(req, res) {
        try {
            const result = await CartService.removeCartItem(req.params.userId, req.params.productId);
            if(!result) {
                return result.status(404).json({ message : "No se logro reflejar el cambio en el carrito."})
            }
            res.status(200).json({ message : "Eliminacion del producto del carrito exitosa."});
        } catch (err) {
            res.status(500).json({ success: false, error: err.message });
        }
    }

    //Listo
    static async purchesCart(req, res) {
        try {
            const result = await CartService.purchase(req.userId, User, Cart, Service,
                async (cartInstance) => SaleService.createSale(Sale,SaleClass,ProductSaleClass,Service,cartInstance),
                async (saleId) => SaleService.addSaleToUserSales(req.userId, saleId, User, Sale, Service)
            );

            if(!result) {
                return result.status(404).json({ message : "Hubo un error al crear la venta."});
            }

            res.status(200).json({message : "Venta realizada con éxito"});
        } catch (err) {
            res.status(500).json({ success: false, error: err.message });
        }
    }

    //Listo
    static async cleanCart(req, res) {
        try {
            const result =  await CartService.emptyCart(req.userId, User, Cart, Service);
            
            if(!result) {
                return result.status(404).json({ message : "Hubo un error al limpiar el carrito."});
            }

            res.status(200).json(result);
        } catch (error) {
            res.status(500).json({ success: false, error: err.message });
        }
    }
}

module.exports = CartRoutes;