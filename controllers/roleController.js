const {  Userrole } = require("../model/userModel");
const {AuditLog} = require("../model/auditLogModel")
const RoleController = { 

    addRole: async (req, res, idUser) => {
        try {
            const Role = await new Userrole({
                name: req.body.name,
                description: req.body.description
            });
            await Role.save().then(()=>{
               const auditLog = new AuditLog(); auditLog.method = req.method
                // SAVE OLD ITEM
                var fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
                //CREATE AUDIT LOG
                auditLog.User_ID = idUser
                auditLog.newItem = Role
                auditLog.url = fullUrl
                auditLog.save();

                res.status(200).json(Role);
            });
           
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
    UpdateRoleByID: async (req, res, id, idUser) => {
        try {
            const role = await Userrole.findById(id);
            const oldRole = await Userrole.findById(id);
            if (!role) {
                return res.status(500).json({
                    "success": false,
                    "message": "did not found role"
                });
            }

            if(req.body.name)
                role.name = req.body.name
            if(req.body.description)
            role.description = req.body.description

            await role.save().then(()=>{
               const auditLog = new AuditLog(); auditLog.method = req.method
                // SAVE OLD ITEM
                var fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
                //CREATE AUDIT LOG
                auditLog.User_ID = idUser
                auditLog.oldItem = oldRole
                auditLog.newItem = role
                auditLog.url = fullUrl
                auditLog.save();
            });

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

    deleteRoleByID: async (res, id, idUser) => {
        try {

            const role = await Userrole.findById(id)

            if (role) {

                Userrole.findByIdAndDelete(id).then(()=>{
                   const auditLog = new AuditLog(); auditLog.method = req.method
                    // SAVE OLD ITEM
                    var fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
                    //CREATE AUDIT LOG
                    auditLog.User_ID = idUser
                    auditLog.oldItem = role
                    auditLog.url = fullUrl
                    auditLog.save();
                })
            
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