// const UserModel = require("../models/user-model");
const db = require('../configuration/mysql');
module.exports = {
  getAllUsersController: async (req, res, next) => {
    try {      
      const data = await db.execute('SELECT * FROM EMPLOYEE WHERE EMPLOYEE.HeadId = ?', [req.params.userId] )
      res.json({
        success: true,
        data: data[0]
      });
    } catch (error) {
      next(error);
    }
  },
  addNewUserController: async (req, res, next) => {
    try {
      const {_id, name, age, sallery, phoneNumber } = req.body;
      
      if(!_id){
        throw new Error("Unauthorized");
      }
      const result = await db.execute('INSERT INTO EMPLOYEE( HeadId, name, age, phoneNumber, sallery) VALUES (?,?,?,?,?)',[_id, name, age, phoneNumber , sallery ])
      if( result[0].insertId !== 0 &&  result[0].insertId < 0){
        throw createError.Conflict("Something want wrong..")
      }
      res.json({
        success: true,
        message: "successful",
      });
    } catch (error) {
      next(error);
    }
  },
  deleteUserByIdController: async (req, res, next) => {
    try {
      const _id = req.params.userId;
      const result = await db.execute('DELETE FROM EMPLOYEE WHERE EMPLOYEE.ID =  ?',[_id] )
      console.log(result);
        res.json({
          success: true,
          message: "Successfully Deleted",
        });
      
    } catch (error) {
      next(error);
    }
  },
};
