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

// Esquemas
const CategorySchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String }
});

CategorySchema.statics.toClassInstance = function (doc) {
    return new CategoryClass(doc._id.toString(), doc.name, doc.description);
};

const CartItemSchema = new mongoose.Schema({
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    amountToBuy: { type: Number, required: true },
    priceTotal: { type: Number, required: true }
});

CartItemSchema.statics.toClassInstance = function (doc) {
    const productInstance = ProductSchema.statics.toClassInstance(doc.product);
    return new CartItemClass(doc._id.toString(), productInstance, doc.amountToBuy);
};

const CartSchema = new mongoose.Schema({
    items: { type: [CartItemSchema], default: [] },
    total: { type: Number, required: true, default: 0 },
    status: { type: String, required: true }
});

CartSchema.statics.toClassInstance = function (doc) {
    const items = doc.items.map(item => CartItemSchema.statics.toClassInstance(item));
    return new CartClass(doc._id.toString(), items, doc.total, doc.status);
};

const ProductSaleSchema = new mongoose.Schema({
    idProduct: { type: String, required: true },
    name: { type: String, required: true },
    brand: { type: String },
    price: { type: Number, required: true },
    stock: { type: Number },
    capacity: { type: String },
    waterproof: { type: Boolean },
    image: { type: String },
    category: { type: String },
    amountBought: { type: Number, required: true },
    priceTotal: { type: Number, required: true }
}, { _id: false });

ProductSaleSchema.statics.toClassInstance = function (doc) {
    return new ProductSaleClass(
        doc.idProduct, doc.name, doc.brand, doc.price, doc.stock, doc.capacity,
        doc.waterproof, doc.image, doc.category, doc.amountBought, doc.priceTotal
    );
};

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

ProductSchema.statics.toClassInstance = function (doc) {
    const categoryInstance = CategorySchema.statics.toClassInstance(doc.category);
    return new ProductClass(
        doc._id.toString(), doc.name, doc.brand, doc.price,
        doc.stock, doc.capacity, doc.waterproof, doc.image, categoryInstance
    );
};

const SaleSchema = new mongoose.Schema({
    products: { type: [ProductSaleSchema], required: true },
    total: { type: Number, required: true },
    date: { type: Date, required: true, default: Date.now },
    status: { type: String, required: true }
});

SaleSchema.statics.toClassInstance = function (doc) {
    const products = doc.products.map(prod => ProductSaleSchema.statics.toClassInstance(prod));
    return new SaleClass(doc._id.toString(), products, doc.total, doc.date, doc.status);
};

const AddressSchema = new mongoose.Schema({
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    zipCode: { type: String, required: true },
    country: { type: String, required: true }
});

AddressSchema.statics.toClassInstance = function (doc) {
    return new AddressClass(doc.street, doc.city, doc.state, doc.zipCode, doc.country);
};

const CustomerUserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    userName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    cart: { type: mongoose.Schema.Types.ObjectId, ref: 'Cart' },
    sales: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Sale' }],
    address: { type: AddressSchema }
}, { discriminatorKey: 'userType' });

CustomerUserSchema.statics.toClassInstance = function (doc) {
    const cartInstance = CartSchema.statics.toClassInstance(doc.cart);
    const saleInstances = doc.sales.map(sale => SaleSchema.statics.toClassInstance(sale));
    const addressInstance = AddressSchema.statics.toClassInstance(doc.address);
    return new CustomerUserClass(
        doc._id.toString(), doc.name, doc.userName, doc.email, doc.password,
        cartInstance, saleInstances, addressInstance
    );
};

// Declaraciones de modelos principales
const Category = mongoose.model('Category', CategorySchema);
const Cart = mongoose.model('Cart', CartSchema);
const Sale = mongoose.model('Sale', SaleSchema);
const Product = mongoose.model('Product', ProductSchema);

// Declaración de CustomerUser debe ir antes de AdminUser
const CustomerUser = mongoose.model('CustomerUser', CustomerUserSchema);

// Ahora sí puedes usar CustomerUser para declarar AdminUser
const AdminUser = CustomerUser.discriminator('AdminUser', new mongoose.Schema({
    role: { type: String, required: true, default: 'admin' }
}));

AdminUser.statics.toClassInstance = function (doc) {
    const cartInstance = CartSchema.statics.toClassInstance(doc.cart);
    const saleInstances = doc.sales.map(sale => SaleSchema.statics.toClassInstance(sale));
    const addressInstance = AddressSchema.statics.toClassInstance(doc.address);
    return new AdminUserClass(
        doc._id.toString(), doc.name, doc.email, doc.password,
        cartInstance, saleInstances, addressInstance, doc.role
    );
};

// Exportaciones
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

