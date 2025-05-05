const express = require('express');
const router = express.Router();
const authRouter = require('../routes/auth');
const cartRouter = require('../routes/cart');
const productRouter = require('../routes/product');
const productsManagementRouter = require('../routes/productsManagement');
const profileRouter = require('../routes/profile');
const usersMangementRouter = require('../routes/usersMangement');

router.use('/user',authRouter);
router.use('/user/cart',cartRouter);
router.use('/product',productRouter);
router.use('/admin/product',productsManagementRouter);
router.use('/admin/users',usersMangementRouter);
router.use('/profile',profileRouter);

module.exports = router;