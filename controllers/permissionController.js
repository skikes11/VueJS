const { Permission } = require("../model/userModel");


const permissionController = {

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
            const permission = await Permission.find().populate('Role_ID');
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
    deletePermissionByID: async (req,res, id) => {
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

module.exports = permissionController;