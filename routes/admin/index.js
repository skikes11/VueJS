const router = require("express").Router();

const productRouter = require("./productRouter")
const orderRouter = require("./orderRouter")
const orderItemRouter = require("./orderItemsRouter")
const permissionRouter = require("./permissionRouter")
const roleRouter = require("./roleRouter")
const userRouter = require("./userRouter")

router.use('/products', productRouter);
router.use('/orders', orderRouter);
router.use('/orderItems', orderItemRouter);
router.use('/permissions', permissionRouter);
router.use('/roles', roleRouter);
router.use('/users', userRouter);

module.exports = router;
