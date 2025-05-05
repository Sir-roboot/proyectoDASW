const Product = require("./AbstractClasses/Product");

class CartItem {
	#idCartItem;
	#product;
    #amountToBuy;
    #priceTotal;
  
    /**
    * @param {string} idCartItem
    * @param {Product} product
    * @param {number} amountToBuy
    */
    constructor(idCartItem, product, amountToBuy) {
    	this.#idCartItem = idCartItem;
    	this.#product = product;
    	this.#amountToBuy = amountToBuy;
    	this.#priceTotal = this.product.price * amountToBuy;
    }
  
    get idCartItem() {
    	return this.#idCartItem;
    }
  
    get product() {
    	return this.#product;
    }
  
    get amountToBuy() {
    	return this.#amountToBuy;
    }
  
    set amountToBuy(value) {
    	if (value > 0) {
    		this.#amountToBuy = value;
    		this.priceTotal = this.product.price * value;
    	}
    }
  
    get priceTotal() {
    	return this.#priceTotal;
    }
  
    classToObjectForMongo() {
    	return {
    		_id: this.idCartItem,
    		product: this.product.idProduct,
    		amountToBuy: this.amountToBuy,
    		priceTotal: this.priceTotal
    	};
    }
}
  
module.exports = CartItem;
  