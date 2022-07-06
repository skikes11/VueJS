const { UserAccount, AuthAccount, Permission, Userrole } = require("../model/userModel");
const { Order, OrderItems } = require("../model/orderModel");

const { Product } = require("../model/productModel");
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
const { ReadPreferenceMode } = require("mongodb");




const adminController = {


    addProduct: async (req, res) => {
        try {
            const product = await new Product({
                name: req.body.name,
                price: req.body.price,
                image: req.body.image,
                brand: req.body.brand,
                origin: req.body.origin,
                description: req.body.description
            });
            await product.save().then(
                console.log("save product successfully")
            );
            res.status(200).json(product);
        } catch (err) {
            res.status(400).json(err.message);

        }
    },
    getAllProduct: async (req, res) => {
        try {
            const product = await Product.find();
            res.status(200).json(product);
        } catch (err) {
            res.status(400).json(err.message);

        }
    },
    updateProduct: async (req, res, id) => {
        try {
            const product = await Product.findById(id);
            if (!product) {
                return res.status(500).json({
                    "success": false,
                    "message": "did not found product"
                });
            }
            product.name = req.body.name
            product.price = req.body.price
            product.image = req.body.image
            product.brand = req.body.brand
            product.origin = req.body.origin
            product.description = req.body.description
            await product.save().then(
                console.log("update product successfully")
            );
            res.status(200).json(product);
        } catch (err) {
            res.status(400).json(err.message);

        }
    },
    deleteProduct: async (req, res, id) => {
        try {
            if (await Product.findByIdAndDelete(id)) {
                res.status(200).json("DELETE PRODUCT SUSCESS");
            } else {
                res.status(200).json({
                    "success": false,
                    "message": "did not found product"
                });
            }
        } catch (err) {
            res.status(400).json(err.message);

        }
    },
    getAllOrder: async (req, res) => {
        try {
            try {
                const order = await Order.find().populate('User_ID');
                res.status(200).json(product);
            } catch (err) {
                res.status(400).json(err.message);

            }

        } catch (err) {
            res.status(400).json(err.message);
        }
    },

    addOrder: async (req, res) => {
        try {
            const order = await new Order({
                User_ID: req.body.User_ID,
                status: req.body.status,
                created: req.body.created
            })
            res.status(200).json(order);

        } catch (err) {
            res.status(400).json(err.message);
        }
    },
    UpdateOrder: async (req, res, id) => {
        try {

            const order = await Order.findById(id)

            if (!order) {
                return res.status(500).json({
                    "success": false,
                    "message": "did not found order"
                });
            }

            order.User_ID = req.body.User_ID
            order.status = req.body.status
            order.created = req.body.created
            order.totalPrice = req.body.totalPrice
            await order.save()
            res.status(200).json(order);

        } catch (err) {
            res.status(400).json(err.message);
        }
    },
    deleteOrder: async (req, res, id) => {
        try {
            if (await Order.findByIdAndDelete(id)) {
                res.status(200).json("DELETE ORDER SUSCESS");
            } else {
                res.status(200).json({
                    "success": false,
                    "message": "did not found order"
                });
            }
        } catch (err) {
            res.status(400).json(err.message);
        }
    },
    getOrderItems_ByOrderID: async (req, res, id) => {
        try {
            try {
                const order = await Order.findOne({ Order_ID: id });
                res.status(200).json(order);
            } catch (err) {
                res.status(400).json(err.message);

            }

        } catch (err) {
            res.status(400).json(err.message);
        }
    },
    addOrderItems: async (req, res) => {
        try {
            const orderItem = await new OrderItems({
                Order_ID: req.body.Order_ID,
                Product_ID: req.body.Product_ID,
                quantity: req.body.quantity
            })
            await orderItem.save();
            res.status(200).json(orderItem);

        } catch (err) {
            res.status(400).json(err.message);
        }
    },
    UpdateOrderItemsByID: async (req, res, id) => {
        try {

            const orderItem = await OrderItems.findById(id)

            if (!orderItem) {
                return res.status(500).json({
                    "success": false,
                    "message": "did not found order Item"
                });
            }

            orderItem.Order_ID = req.body.Order_ID
            orderItem.Product_ID = req.body.Product_ID
            orderItem.quantity = req.body.quantity

            await orderItem.save()
            res.status(200).json(orderItem);

        } catch (err) {
            res.status(400).json(err.message);
        }
    },
    addUser: async (req, res) => {

        try {

            uploadAvatar(req, res, async (err) => {
                const user = await UserAccount.findOne({ email: req.body.email });
                console.log(req.body)
                console.log("####check Pass : " + checkPass(req))

                if (err) {
                    return res.status(404).json({
                        "message": "can not upload file image"
                    })
                } else if (user) {
                    return res.render("register", {
                        mess: "email already in use"
                    })
                } else if (!checkPass(req)) {
                    return res.render("register", {
                        mess: "password did not match"
                    })
                } else {

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
    getAllUser: async (req, res) => {
        try {
            const users = await UserAccount.find();
            // Update InforUserID for user
            const { password, ...others } = users._doc;
            res.status(200).json({
                "success": true,
                "data": { ...others }
            });
        } catch (err) {
            res.status(500).json({
                "success": false,
                "message": "did not found any user" + + err.message
            });
            logger.info({
                "success": false,
                "message": "did not found any user" + + err.message
            })
        }
    },

    deleteUserByID: async (res, id) => {
        try {
            if (await UserAccount.findByIdAndDelete(id)) {
                res.status(200).json("DELETE USER SUSCESS");
            } else {
                res.status(200).json({
                    "success": false,
                    "message": "did not found user"
                });
            }
        } catch (err) {
            res.status(500).json(err.message);

        }
    },
    UpdateUserByID: async (req, res, id) => {
        try {
            const user = await UserAccount.findById(id);
            if (!user) {
                return res.status(500).json({
                    "success": false,
                    "message": "did not found user"
                });
            }
            user.name = req.body.name;
            user.email = req.body.email;
            user.phone = req.body.phone;
            user.dob = req.body.dob;

            await user.save();
            res.status(500).json({
                "success": true,
                "data": user
            });
        } catch (err) {
            res.status(404).json({
                "success": false,
                "message": "update user failed",
                "error": err.message
            });
        }
    },
    addRole: async (req, res) => {
        try {
            const Role = await new Userrole({
                name: req.body.name,
                description: req.body.description
            });
            await Role.save();
            res.status(200).json(Role);
        } catch (err) {
            res.status(400).json(err.message);

        }
    },
    getAllRole: async (req, res) => {
        try {
            const userrole = await Userrole.find();
            if (!userrole) {
                return res.status(500).json({
                    "success": false,
                    "message": "did not found role"
                });
            }

            // Update InforUserID for user
            res.status(200).json({
                "success": true,
                "data": userrole
            });
        } catch (err) {
            res.status(500).json({
                "success": false,
                "message": "did not found any userrole" + err.message
            });
            logger.info({
                "success": false,
                "message": "did not found any userrole"
            })
        }
    },
    UpdateRoleByID: async (req, res, id) => {
        try {
            const role = await Userrole.findById(id);
            if (!user) {
                return res.status(500).json({
                    "success": false,
                    "message": "did not found role"
                });
            }

            role.name = req.body.name
            role.description = req.body.description

            await role.save();

            res.status(500).json({
                "success": true,
                "data": role
            });
        } catch (err) {
            res.status(404).json({
                "success": false,
                "message": "update role failed",
                "error": err.message
            });
        }
    },

    deleteRoleByID: async (res, id) => {
        try {
            if (await Userrole.findByIdAndDelete(id)) {
                res.status(200).json("DELETE ROLE SUSCESS");
            } else {
                res.status(200).json({
                    "success": false,
                    "message": "did not found role"
                });
            }
        } catch (err) {
            res.status(402).json(err.message);

        }
    },
    addPermission: async (req, res) => {
        try {
            const permission = await new Permission({
                Role_ID: req.body.Role_ID,
                endpoint: req.body.endpoint,
                method: req.body.method
            });
            await permission.save();
            res.status(200).json(permission);
        } catch (err) {
            res.status(400).json(err.message);
        }
    },
    UpdatePermissionByID: async (req, res, id) => {
        try {
            const permission = await Permission.findById(id);
            if (!permission) {
                return res.status(500).json({
                    "success": false,
                    "message": "did not found role"
                });
            }
            permission.Role_ID = req.body.Role_ID
            permission.endpoint = req.body.endpoint
            permission.method = req.body.method

            await permission.save();

            res.status(500).json({
                "success": true,
                "data": permission
            });
        } catch (err) {
            res.status(404).json({
                "success": false,
                "message": "update role failed",
                "error": err.message
            });
        }
    },
    getAllPermission: async (req, res) => {
        try {
            const permission = await Permission.find();
            if (!permission) {
                return res.status(500).json({
                    "success": false,
                    "message": "did not found role"
                });
            }

            // Update InforUserID for user
            res.status(200).json({
                "success": true,
                "data": permission
            });
        } catch (err) {
            res.status(500).json({
                "success": false,
                "message": "did not found any userrole" + err.message
            });

        }
    },
    deletePermissionByID: async (res, id) => {
        try {
            if (await Permission.findByIdAndDelete(id)) {
                res.status(200).json("DELETE PERMISSION SUSCESS");
            } else {
                res.status(200).json({
                    "success": false,
                    "message": "did not found permission"
                });
            }
        } catch (err) {
            res.status(402).json(err.message);

        }
    },
    getPermissionByRoleID: async (req, res, id) => {
        try {
            const permission = await Permission.findOne({ Role_ID: id });
            if (!permission) {
                return res.status(500).json({
                    "success": false,
                    "message": "did not found permission"
                });
            }

            // Update InforUserID for user
            res.status(200).json({
                "success": true,
                "data": permission
            });
        } catch (err) {
            res.status(500).json({
                "success": false,
                "message": "did not found any permission" + err.message
            });

        }
    },



};

module.exports = adminController;