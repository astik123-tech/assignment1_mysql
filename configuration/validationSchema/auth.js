const joi = require('joi')
const authUser = joi.object({
    name : joi.string().required(),
    phoneNumber : joi.string().required() ,
    email: joi.string().email().lowercase().required(),
    password: joi.string()
        .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$'))
}) 

module.exports = {
    authUserSchema:authUser
}