const router = require("express").Router();
const userRouter = require("../routes/user/index");
const verifyRouter = require("./verifyRouter");
const authRouter = require("./authRouter");
const adminRouter = require("../routes/admin/index");

router.use('/', userRouter)

router.use('/verify',verifyRouter)

router.use('/auth',authRouter)

router.use('/admin', adminRouter)

module.exports = router;