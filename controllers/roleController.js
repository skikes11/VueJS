const {  Userrole } = require("../model/userModel");

const RoleController = { 

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
            if (!role) {
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
}

module.exports = RoleController;