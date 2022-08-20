

const helperFunc = {
    status : async(res, success, data, message) =>{        
            res.status(200).json({
                "success" : success,
                "data": data,
                "message" : message
            });
       
    },
    status_error : async(res, message) =>{        
        res.status(403).json({
            "success" : false,
            "message" : message
        });
   
},

    
}

module.exports = helperFunc;