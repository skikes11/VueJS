const router = require("express").Router();
const userRouter = require("./userRouter");
const verifyRouter = require("./verifyRouter");
const authRouter = require("./authRouter");
const adminRouter = require("./adminRouter");

router.use('/users', userRouter)

router.use('/verify',verifyRouter)

router.use('/auth',authRouter)

router.use('/admin', adminRouter)

module.exports = router;