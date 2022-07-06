
const middlewareController = require("../controllers/middlewareController");
const userRouter = require("express").Router();
const userController = require("../controllers/userController");
const TokenModel = require("../model/tokenModel");



userRouter.get("/account/:token", async(req,res)=>{
    try {

        //check token da su dung roi 
        const CheckTokenUsed = await TokenModel.findOne({ value : req.params.token})

        if(CheckTokenUsed) { 
            console.log("check Token " + CheckTokenUsed)
            return res.render("errorToken");
        }
        


        // check token hop le
        const user = await middlewareController.verifyTokenAccount(req.params.token);

        //sau khi lay duoc user thi luu lai token de check vao lan sau 
        const TokenUsed = new TokenModel({ value : req.params.token });
        TokenUsed.save();




        console.log(user);
        if (!user){
            return res.status(401).json({
                "success":false,
                "message": "authentication fail"
            })
        }

        // enable user
        userController.activeUserAccountByToken(req,res,user.id) 

    } catch (error) {
            res.status(404).json(error.message);
    }
})

userRouter.get("/reset-password/:token", async(req,res)=>{
    try {


         //check token da su dung roi 
         const CheckTokenUsed = await TokenModel.findOne({ value : req.params.token})

         if(CheckTokenUsed || !req.params.token) { 
             console.log("check Token " + CheckTokenUsed)
             return res.render("errorToken");
         }

         // check token hop le
         const user = await middlewareController.verifyTokenAccount(req.params.token);

        res.render("resetPassword",{
            token : req.params.token
        })

    } catch (error) {
            res.status(404).json(error.message);
    }
})

userRouter.post("/reset-passwordV1", async(req,res)=>{
    try {
        // check token hop le
        const user = await middlewareController.verifyTokenAccount(req.body.token);

        //sau khi lay duoc user thi luu lai token de check vao lan sau 
          const TokenUsed = new TokenModel({ value : req.body.token });
          TokenUsed.save();
 

        if (!user){
            return res.status(401).json({
                "success":false,
                "message": "authentication fail"
            })
        }

       userController.resetPassword(req,res,user.id);

    } catch (error) {
            res.status(404).json(error.message);
    }
})

userRouter.post("/forgot-password", userController.forgotPassword);




module.exports = userRouter;