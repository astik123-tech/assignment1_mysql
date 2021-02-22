const mysql = require('mysql2');

const pool = mysql.createPool({
    host:'localhost',
    user:'root',
    database:'assignment',
    password:""
})


module.exports = pool.promise();