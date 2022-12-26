const jwt = require('jsonwebtoken')
const userModel = require('../model/usermodel')


exports.authentication = async (req, res, next) => {

    try {

        let payload

        
        let token=req.headers.authorization
        if(!token){
            return res.status(400).send({status:false,message:"Please provide jwt token"})
        }
        
        token=token.split(" ")[1]
        const decoded=jwt.verify(token,"the-secret-key",(err,data)=>{
            if(err){
                return res.status(401).send({status:false,message:err.message})
            }
            else{
                
                payload=data
            }
        })
        const isValidUser=await userModel.findById(payload.userId)
        if(!isValidUser){
            return res.status(401).send({status:false,message:"Not a registered user!"})
        }
       
        next()
    }
    catch (err) {
        res.status(500).send({ status: false, message: err.message })
    }
}


exports.authorization = async (req, res, next) => {

    try {
        
        const userId=req.params.userId
        let payload

        let token=req.headers.authorization
        token=token.split(" ")[1]
        
        if(!token){
            return res.status(400).send({status:false,message:"Please provide jwt token"})
        }

        const decoded=jwt.verify(token,"the-secret-key",(err,data)=>{
            if(err){
                return res.status(401).send({status:false,message:err.message})
            }
            else{
                
                payload=data
            }
        })
        const isValidUser=await userModel.findById(payload.userId)
        if(!isValidUser){
            return res.status(401).send({status:false,message:"You rae not registered!"})
        }
        else{
            if(userId!=payload.userId){
                return res.status(401).send({status:false,message:"You are not authorised to perform this task!"})
            }
        }
        next()
    }
    catch (err) {
        res.status(500).send({ status: false, message: err.message })
    }
}
