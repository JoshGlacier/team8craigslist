const mysql = require('mysql');
const util = require('util');

const mysqlConnection = mysql.createConnection({
    host : process.env.MYSQL_HOST,
    user : process.env.MYSQL_USER,
    password : process.env.MYSQL_PASSWORD,
    database : process.env.MYSQL_DATABASE,
    multipleStatements : true
  });
  
  mysqlConnection.connect((err) => {
    if (!err) {
      console.log("Connected");
    }
    else {
      console.log("Connection Failed");
    }
  })

mysqlConnection.query = util.promisify(mysqlConnection.query)

module.exports = mysqlConnection;