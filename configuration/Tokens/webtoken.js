const jwt = require('jsonwebtoken')
const creteError = require('http-errors')
const Keys =  require('./key')
const ACCESS_SECRET_KEY =  Keys.ACCESS_SECRET_KEY

module.exports = {
     signAccessToken:(userId) => { 
         return new Promise ( (resolve,reject) => { 
             const payload = {
             }
             const secret = ACCESS_SECRET_KEY
             const options= {
                 expiresIn:'1h',
                 issuer:"authComplete",
                 audience:userId.toString()
             } 
             jwt.sign(payload, secret,options, (err,token) => {
                 if(err){
                 
                    reject (creteError.InternalServerError())
                 }
                 resolve(token)
             })
         })
     },

     verifyAccessToken:(req,res,next) => {
         if(!req.headers['authorization']) {
             return next(creteError.Unauthorized())
         }
         const authHeader = req.headers['authorization'] 
         const bearerToken = authHeader.split(' ')
         const token = bearerToken[1]
         jwt.verify(token , ACCESS_SECRET_KEY, (err, payload )=> { 
             if(err){
                const message = err.name == 'JsonWebTokenError' ? 'Unauthorized' : err.message 
                return next(creteError.Unauthorized(message))
             }
             res.payload = payload 
             next()
         })
     }
}