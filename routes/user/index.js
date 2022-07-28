const router = require("express").Router();

const productRouter = require("./productRouter")
const orderRouter = require("./ordersRouter")
const cartRouter = require("./cartRouter")
const testRouter = require("./testRouter")


router.use('/products', productRouter);
router.use('/orders', orderRouter);
router.use('/cart', cartRouter);
router.use('/test', testRouter);


module.exports = router;
