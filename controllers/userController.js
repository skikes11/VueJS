const { UserAccount, AuthAccount,   Userrole } = require("../model/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const e = require("express");
const logger = require("../controllers/logger/winstonLogger");
const EmailSender = require("../controllers/email/emailSender");
const middlewareController = require("./middlewareController");
const fs = require('fs');
const { Console } = require("console");
const { uploadAvatar } = require("./helpers");
const { boolean } = require("joi");
const { Order, OrderItems } = require("../model/orderModel");
const { Product } = require("../model/productModel");





function isImage(url) {
    return /\.(jpg|jpeg|png|webp|avif|gif|svg)$/.test(url);
}

function validateURL(link) {
    if (link.indexOf("http://") == 0 || link.indexOf("https://") == 0) {
        return true;
    }
    else {
        return false;
    }
}

function checkPass(req){
    if (req.body.password != req.body.rePassword) {
        return false;
    }
    return true;
}

const userController = {
    addUser: async (req, res) => {
        try {
            uploadAvatar(req, res, async(err) => {
                const user = await UserAccount.findOne({ email: req.body.email });
                console.log( req.body)
                console.log("####check Pass : "+checkPass(req))

                if (err) {
                    return res.status(404).json({
                        "message": "can not upload file image"
                    })
                }else if(user){
                    return res.render("register", {
                        mess : "email already in use"
                    })
                }else if(!checkPass(req)){
                    return res.render("register", {
                        mess : "password did not match"
                    })
                }else {
 
                    const salt = await bcrypt.genSalt(10);
                    const hashPass = await bcrypt.hash(req.body.password, salt);


                    const newUser = await new UserAccount({
                        email: req.body.email,
                        name: req.body.name,
                        password: hashPass,
                        phone: req.body.phone,
                        dob: req.body.dob,

                    });

                    if (req.file) {
                        newUser.avatar = `/static/images/avatar/${req.file.filename}`
                    } else {
                        if (isImage(req.body.url)) {
                            newUser.avatar = req.body.url
                        }
                    }

                    const tokenActivate = jwt.sign({
                        id: newUser._id
                    }, process.env.JWT_ACCESS_KEY, {
                        expiresIn: "30m"
                    });

                    fullTokenActivate = "Bearer " + tokenActivate;

                    const URL = "http://localhost:8000/api/verify/account/" + fullTokenActivate;
                    console.log('URL', URL)
                    const content = `Click <a href = "${URL}" > here  </a> to activate your account`;

                    Iuser = await Userrole.findOne({ name: new RegExp('^' + "user" + '$', "i") });
                    newUser.role = Iuser._id;
                    console.log(newUser);

                    EmailSender(res, newUser.email, "Active Your Account", content);
                    await newUser.save();
                    // res.status(200).json({
                    //     newUser,
                    //     tokenActivate
                    // });
                    res.render("registrationComplete");
                }
            })

        } catch (err) {
            res.status(400).json(err.message);
        }
    },

    clickBuyProduct: async (req, res, UserID, ProductID) => {
        try {

            const order = await  Order.findOne({ User_ID : UserID, status : 0 })     //status order : 0 - Don hang van chua thanh toan (con trong gio hang)  1 - Don hang da thanh toan nhung chua duoc xac nhan  2 - Don hang da duoc xac nhan         
            if(order){   // Check if order exist in cart then add orderitem to order 
               
                const orderItems = await OrderItems.findOne({ Order_ID : order._id, Product_ID: ProductID }); 
                const product = await Product.findById(ProductID);
                if(orderItems){ // check if orderItem exist in order and have same product id then just plus quantity in orderItem
                    orderItems.quantity = orderItems.quantity + 1
                    orderItems.save();

                    order.totalPrice = order.totalPrice + product.price; // update order price 
                    order.save();
                }else{ 
                    const orderItem = new OrderItems({
                        Order_ID : order.id,
                        Product_ID : ProductID,
                        quantity : 1
                    })
                    orderItem.save();

                    order.totalPrice = order.totalPrice + product.price; // update order price 
                    order.save();
                }
            }else{
                const newOrder = new Order({
                    User_ID : UserID,
                    status : 0,
                    totalPrice : 0,
                })

                await newOrder.save();

                const newOrderItem = new OrderItems({
                    Order_ID : newOrder._id,
                    Product_ID : ProductID,
                    quantity : 1
                })
                newOrderItem.save();
            }                        


                                                                                                 
        } catch (err) {
            res.status(500).json({
                "success": false,
                "message": "buying product getting error" + err.message
            });
            
        }
    },




























    forgotPassword: async (req, res) => {
        try {
            const user = await UserAccount.findOne({ "email": req.body.email });
            if (!user) {
                return res.render("forgotPassword", {
                    mess: "Invalid Email"
                })
            } else {
                console.log("userID: " + user._id);

                const tokenActivate = jwt.sign({
                    id: user._id
                }, process.env.JWT_ACCESS_KEY, {
                    expiresIn: "30m"
                });

                fullTokenActivate = "Bearer " + tokenActivate;

                const URL = "http://localhost:8000/api/verify/reset-password/" + fullTokenActivate;
                console.log('URL', URL)
                const content = `Click <a href = "${URL}" > here  </a> to reset your password`;

                await EmailSender(res, req.body.email, "Reset your password", content);
                res.render("forgotPasswordV1");

            }
        } catch (err) {
            res.status(400).json(err.message);

        }
    },




    resetPassword: async (req, res, id) => {
        try {
            const user = await UserAccount.findById(id);

            if (!user) {
                return res.status(403).json({
                    "success": false,
                    "message": "Invalid token"
                })
            } else {

                if (!req.body.NewPassword || !req.body.reNewPassword) {
                    return res.status(403).json({
                        "success": false,
                        "message": "you need to fill in require text box"
                    })
                }

                if (req.body.NewPassword == req.body.reNewPassword) {
                    const salt = await bcrypt.genSalt(10);
                    const newPassword = await bcrypt.hash(req.body.NewPassword, salt);
                    user.password = newPassword;
                    await user.save();
                    res.render("resetPasswordCompleted");
                } else {
                    return res.status(403).json({
                        "success": false,
                        "message": "New Password and Comfirm Password does not match"
                    })
                }
            }

        } catch (err) {
            res.status(400).json(err.message);

        }
    },

    activeUserAccountByToken: async (req, res, id) => {
        try {

            const user = await UserAccount.findById(id).populate("role");

            if (!user) {
                return res.status(403).json({
                    "success": false,
                    "message": "Invalid token"
                })
            } else {
                user.active = true;
                console.log("activate: " + user.active)
                await user.save();
                // res.status(200).json({
                //     "success": true,
                //     "message": "Verify account success",
                //     "data": user
                // });

                res.render("verifyAccountCompleted");

            }

        } catch (err) {
            res.status(400).json(err.message);

        }
    },
    
   
    UpdateUserByToken: async (req, res, id, checkAuth) => {
        try {


            if(checkAuth==0){
            const user = await UserAccount.findById(id);

            if (!user) {
                return res.status(500).json({
                    "success": false,
                    "message": "did not found user"
                });
            }
            user.name = req.body.name;
            user.phone = req.body.phone;
            user.dob = req.body.dob;


            if(!user.avatar){
                user.avatar = "default"
            }

            if (req.file) {
                if (!validateURL(user.avatar)&& user.avatar != "default") {
                    var oldPath = "." + user.avatar;
                    var getPath = oldPath.replace('static', 'public')
                    await fs.unlinkSync(getPath);
                    console.log("unlink path" + getPath);
                }
                user.avatar = `/static/images/avatar/${req.file.filename}`
            } else {
                if (isImage(req.body.url)) {

                    if (!validateURL(user.avatar) && user.avatar != "default" ) {
                        var oldPath = "." + user.avatar;
                        var getPath = oldPath.replace('static', 'public')
                        await fs.unlinkSync(getPath);
                        console.log("unlink path" + getPath);
                    }

                    user.avatar = req.body.url
                }
            }

            await user.save();

        }else if(checkAuth == 1){

            const user_FB = await AuthAccount.findById(id);

            if (!user_FB) {
                return res.status(500).json({
                    "success": false,
                    "message": "did not found user"
                });
            }
            user_FB.facebook.name = req.body.name;
            user_FB.facebook.phone = req.body.phone;
            user_FB.facebook.dob = req.body.dob;


            if(!user_FB.facebook.avatar){
                user_FB.facebook.avatar = "default"
            }


            if (req.file) {
                if (!validateURL(user_FB.facebook.avatar)&& user_FB.facebook.avatar != "default") {
                    var oldPath = "." + user_FB.facebook.avatar;
                    var getPath = oldPath.replace('static', 'public')
                    await fs.unlinkSync(getPath);
                    console.log("unlink path" + getPath);
                }
                user_FB.facebook.avatar = `/static/images/avatar/${req.file.filename}`
            } else {
                if (isImage(req.body.url)) {

                    if (!validateURL(user_FB.facebook.avatar) && user_FB.facebook.avatar != "default" ) {
                        var oldPath = "." + user_FB.facebook.avatar;
                        var getPath = oldPath.replace('static', 'public')
                        await fs.unlinkSync(getPath);
                        console.log("unlink path" + getPath);
                    }

                    user_FB.facebook.avatar = req.body.url
                }
            }

            await user_FB.save();
            
        }else if (checkAuth == 2){

            const user_GG = await AuthAccount.findById(id);

            if (!user_GG) {
                return res.status(500).json({
                    "success": false,
                    "message": "did not found user"
                });
            }
            user_GG.google.name = req.body.name;
            user_GG.google.phone = req.body.phone;
            user_GG.google.dob = req.body.dob;


            if(!user_GG.google.avatar){
                user_GG.google.avatar = "default"
            }


            if (req.file) {
                if (!validateURL(user_GG.google.avatar)&& user_GG.google.avatar != "default") {
                    var oldPath = "." + user_GG.google.avatar;
                    var getPath = oldPath.replace('static', 'public')
                    await fs.unlinkSync(getPath);
                    console.log("unlink path" + getPath);
                }
                user_GG.google.avatar = `/static/images/avatar/${req.file.filename}`
            } else {
                if (isImage(req.body.url)) {

                    if (!validateURL(user_GG.google.avatar) && user_GG.google.avatar != "default" ) {
                        var oldPath = "." + user_GG.google.avatar;
                        var getPath = oldPath.replace('static', 'public')
                        await fs.unlinkSync(getPath);
                        console.log("unlink path" + getPath);
                    }

                    user_GG.google.avatar = req.body.url
                }
            }

            await user_GG.save();
        }


        res.redirect("/");



        } catch (err) {
            res.status(404).json({
                "success": false,
                "message": "update user failed",
                "error": err.message
            });
        }
    },
    ChangeUserPassword: async (req, res, id) => {
        try {
            const user = await UserAccount.findById(id);
            if (!user) {
                return res.status(500).json({
                    "success": false,
                    "message": "did not found user"
                });
            } else {
                const checkPass = await bcrypt.compare(req.body.OldPassword, user.password);
                if (!checkPass) {
                    return res.status(400).json({
                        "success": false,
                        "message": "wrong password"
                    });
                } else {
                    const salt = await bcrypt.genSalt(10);
                    const newPassword = await bcrypt.hash(req.body.newPassword, salt);
                    user.password = newPassword;
                    user.save();
                    res.status(500).json({
                        "success": true,
                        "data": user
                    });
                }
            }


        } catch (err) {
            res.status(404).json({
                "success": false,
                "message": "update user failed",
                "error": err.message
            });
        }
    },
    activeOrBlockUserAccountByID: async (res, id) => {
        try {
            const user = await UserAccount.findById(id);

            if (!user) {
                return res.status(403).json({
                    "success": false,
                    "message": "did not found user"
                })
            }

            if (!user.active) {
                user.active = true;
            } else {
                user.active = false;
            }
            user.save();
            // Update InforUserID for user
            res.status(500).json({
                "success": true,
                "data": user

            });
        } catch (err) {
            res.status(404).json({
                "success": false,
                "message": "block or unblock user failed",
                "error": err.message
            });
        }
    }
    ,
    loginUser: async (req, res) => {
        try {
            const user = await UserAccount.findOne({ email: req.body.email }).populate("role");
            if (!user) {
                
                res.render("index",{
                    mess : "username or password not match"
                })
            } else {
                const checkPass = await bcrypt.compare(req.body.password, user.password);
                if (!checkPass) {

                    res.render("index",{
                        mess : "username or password not match"
                    })
                } else {
                    if (!user.active) {

                        res.render("index",{
                            mess : "your account have not activated or get blocked"
                        })

                       
                    } else {

                        if (!user.role.name) {
                            return res.status(403).json({
                                "success": false,
                                "message": "userrole is Null"
                            })
                        }

                        //Tao Token
                        const tokenAccess = jwt.sign({
                            id: user._id,
                            role: user.role.name
                        }, process.env.JWT_ACCESS_KEY, {
                            expiresIn: "1d"
                        });




                        const { password, ...others } = user._doc;
                        const fullToken = `Bearer ${tokenAccess}`

                        // Luu Token vao Cokie
                        res.cookie('access_token', fullToken, {
                            maxAge: 365 * 24 * 60 * 60 * 100, // thời gian sống 
                            httpOnly: true, // chỉ có http mới đọc được token
                            //secure: true; //ssl nếu có, nếu chạy localhost thì comment nó lại
                        })

                        console.log("userRender" + {
                            ...others
                        })

                        res.render("userProfile", {
                            user: { ...others }
                        })


                    }
                }
            }

        } catch (err) {
            console.log("err ", err);
            res.status(400).json({
                "success": false,
                "message": err.message
            });

        }
    }
};

module.exports = userController;