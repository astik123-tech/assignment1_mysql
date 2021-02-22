// const authModel =  require('../models/auth-model');
const AuthValidation = require('../configuration/validationSchema/auth');
const  { signAccessToken } = require('../configuration/Tokens/webtoken')
const createError = require('http-errors')
const bcrypt = require('bcrypt')
const db = require('../configuration/mysql');

module.exports = {
    register:async(req, res, next)=>{
        try {
            let {name, phoneNumber, email, password, confirmPassword } = req.body
            if (!name || !phoneNumber ||!email || !password || !confirmPassword) {
                throw createError.BadRequest()
            }
            await AuthValidation.authUserSchema.validateAsync({name, phoneNumber,email, password})

            if(password !== confirmPassword){
                throw createError.Conflict(`Password and confirm password must be same`)
            }
            const salt = await bcrypt.genSalt(10)
            const hashedPassword = await bcrypt.hash(password, salt)  
            email = email.toLowerCase()
            const  result = await db.execute('INSERT INTO AUTH(name, phoneNumber, email, password) VALUES (?, ?, ?, ?)',[name, phoneNumber, email, hashedPassword]
            )
            if( result[0].insertId !== 0 &&  result[0].insertId < 0){
               throw createError.Conflict("Something want wrong..")
            }
            const accessToken = await signAccessToken(result[0].insertId)
            res.send({
                email:email.toLowerCase(),
                id:result[0].insertId,
                accessToken: accessToken
            })
        } catch (error) {
            if (error.isJoi == true) {
                error.status = 422
            }
            next(error)
        }
    },
    login:async(req, res, next)=>{
        try {
            let { email, password } = req.body
            if (!email || !password) {
                throw createError.BadRequest()
            }
            email = email.toLowerCase();
           const result = await db.execute('SELECT AUTH.ID, AUTH.phoneNumber, AUTH.email, AUTH.password FROM AUTH WHERE AUTH.phoneNumber = ? OR AUTH.email = ?', [email ,email])
           if (result[0][0].ID !==0 && result[0][0].ID < 0) {
                return next(createError.NotFound("User not found"))
            }
            const isConfirm = await bcrypt.compare(password, result[0][0].password)
            if(!isConfirm){
                return next(createError.BadRequest("Invalid username/password"))
            }
            const accessToken = await signAccessToken(result[0][0].ID)
            res.send({
                email:result[0][0].email,
                id:result[0][0].ID,
                accessToken: accessToken
                })
        } catch (error) {
            if (error.isJoi === true) {
                return next(createError.BadRequest("Invalid username/password"))
            }
            next(error)
        }
    }
}