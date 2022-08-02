

const helperFunc = {
    status : async(res, success, data, message) =>{
       
   
            
            res.status(200).json({
                "success" : success,
                "data": data,
                "message" : message
            });
       
    }
}

module.exports = helperFunc;