// 📦 Imports
const mongoose = require('mongoose');

const CategoryClass = require('../Classes/Category');
const CartItemClass = require('../Classes/CartItem');
const CartClass = require('../Classes/Cart');
const ProductSaleClass = require('../Classes/ProductSale');
const SaleClass = require('../Classes/Sale');
const AddressClass = require('../Classes/Address');
const CustomerUserClass = require('../Classes/CustomerUser');
const AdminUserClass = require('../Classes/AdminUser');
const ProductClass = require('../Classes/AbstractClasses/Product');

// 🧱 Esquemas
const CategorySchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String }
});

const CartItemSchema = new mongoose.Schema({
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    amountToBuy: { type: Number, required: true },
    priceTotal: { type: Number, required: true }
});

const CartSchema = new mongoose.Schema({
    items: { type: [CartItemSchema], default: [] },
    total: { type: Number, required: true, default: 0 },
    status: { type: String, required: true }
});

const ProductSaleSchema = new mongoose.Schema({
    idProduct: { type: String, required: true },
    name: { type: String, required: true },
    brand: { type: String },
    price: { type: Number, required: true },
    stock: { type: Number },
    capacity: { type: String },
    waterproof: { type: Boolean },
    image: { type: String },
    category: {
        name: { type: String, required: true },
        description: { type: String }
    },
    amountBought: { type: Number, required: true },
    priceTotal: { type: Number, required: true }
}, { _id: false });

const ProductSchema = new mongoose.Schema({
    name: { type: String, required: true },
    brand: { type: String },
    price: { type: Number, required: true },
    stock: { type: Number, required: true },
    capacity: { type: String },
    waterproof: { type: Boolean },
    image: { type: String },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' }
});

const SaleSchema = new mongoose.Schema({
    products: { type: [ProductSaleSchema], required: true },
    total: { type: Number, required: true },
    date: { type: Date, required: true, default: Date.now },
    status: { type: String, required: true }
});

const AddressSchema = new mongoose.Schema({
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    zipCode: { type: String, required: true },
    country: { type: String, required: true }
});

const CustomerUserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    userName: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    date: { type: Date, required: true, default: Date.now },
    role: { type: String, required: true, default: 'customer' },
    cart: { type: mongoose.Schema.Types.ObjectId, ref: 'Cart' },
    sales: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Sale' }],
    address: { type: AddressSchema }
});

const AdminUserSchema = new mongoose.Schema({
    customerRef: { type: mongoose.Schema.Types.ObjectId, ref: 'CustomerUser' }
});

// 🧠 Métodos estáticos
CategorySchema.statics.toClassInstance = function (doc) {
    return CategoryClass.fromObject(doc);
};

CartSchema.statics.toClassInstance = function (doc) {
    return CartClass.fromObject(doc);
};

SaleSchema.statics.toClassInstance = function (doc) {
    return SaleClass.fromObject(doc);
};

AddressSchema.statics.toClassInstance = function (doc) {
    return AddressClass.fromObject(doc);
};

CustomerUserSchema.statics.toClassInstance = function (doc) {
    return CustomerUserClass.fromObject(doc);
};

ProductSaleSchema.statics.toClassInstance = function (doc) {
    return ProductSaleClass.fromObject(doc);
};

ProductSchema.statics.toClassInstance = function (doc) {
    const categoryInstance = CategorySchema.statics.toClassInstance(doc.category);
    return new ProductClass(
        doc._id.toString(), doc.name, doc.brand, doc.price,
        doc.stock, doc.capacity, doc.waterproof, doc.image, categoryInstance
    );
};

CartItemSchema.statics.toClassInstance = function (doc) {
    const productInstance = ProductSchema.statics.toClassInstance(doc.product);
    return new CartItemClass(doc._id.toString(), productInstance, doc.amountToBuy);
};

CartSchema.statics.getNewId = function () {
    return new mongoose.Types.ObjectId();
};

ProductSchema.statics.getNewId = function () {
    return new mongoose.Types.ObjectId();
};

SaleSchema.statics.getNewId = function () {
    return new mongoose.Types.ObjectId();
};

CustomerUserSchema.statics.getNewId = function () {
    return new mongoose.Types.ObjectId();
};

AdminUserSchema.statics.getNewId = function () {
    return new mongoose.Types.ObjectId();
};

AdminUserSchema.statics.toClassInstance = async function(doc) {
    const customerDoc = await CustomerUser.findById(doc.customerRef).exec();
    if (!customerDoc) {
        throw new Error(`CustomerUser con id ${doc.customerRef} no encontrado`);
    }
    const customerInstance = CustomerUser.schema.statics.toClassInstance(customerDoc);

    return new AdminUserClass(
        doc._id.toString(),
        customerInstance.idUser,
        customerInstance.name,
        customerInstance.userName,
        customerInstance.email,
        customerInstance.password,
        customerInstance.registerDate,
        customerInstance.role,
        customerInstance.cart,
        customerInstance.purchaseHistory,
        customerInstance.address
    );
};

// 🏷️ Modelos principales
const Category = mongoose.model('Category', CategorySchema);
const Cart = mongoose.model('Cart', CartSchema);
const Sale = mongoose.model('Sale', SaleSchema);
const Product = mongoose.model('Product', ProductSchema);
const CustomerUser = mongoose.model('CustomerUser', CustomerUserSchema);
const AdminUser = mongoose.model('AdminUser', AdminUserSchema);

// 📤 Exportaciones
module.exports = {
    Category,
    CartItemSchema,
    Cart,
    ProductSaleSchema,
    Sale,
    AddressSchema,
    CustomerUser,
    AdminUser,
    Product
};
