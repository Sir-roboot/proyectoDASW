const CartService = require('../../Classes/ServicesClasses/CartService');

class CartRoutes {
    
    static async getCart(req, res) {
        try {
            const result = await CartService.getCart(req.params.userId);
            res.status(200).json(result);
        } catch (err) {
            res.status(500).json({ success: false, error: err.message });
        }
    }

    static async addToCart(req, res) {
        try {
            const { productId, amount } = req.body;
            const result = await CartService.addToCart(req.params.userId, productId, amount);
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
}

module.exports = CartRoutes;