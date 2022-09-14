const {  Userrole } = require("../model/userModel");
const {AuditLog} = require("../model/auditLogModel")
const fs = require('fs');


const testController = { 

    readFile: async (req, res) => {
        try {

            
           

            let rawdata = fs.readFileSync('fileJson.json');
            let student = JSON.parse(rawdata);
            res.status(200).json(student)


            
        } catch (err) {

            res.status(400).json(err.message);

        }
    }
}

module.exports = testController;