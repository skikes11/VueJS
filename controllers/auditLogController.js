const { AuditLog } = require("../model/auditLogModel")

const auditLogController = {
    GetAllAuditLog : async(req,res) =>{
       
        try {
            const auditlog = await AuditLog.find().populate('User_ID')
            res.status(200).json(auditlog);
        } catch (err) {
            res.status(400).json(err.message);

        }
    }
}

module.exports = auditLogController;