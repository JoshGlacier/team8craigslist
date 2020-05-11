const mysql = require('mysql');
const util = require('util');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, './.env') })


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
      console.log(err)
    }
  })

function getUsersSignUp(username, lastname, password, email, callback) {
  const sql = `INSERT into USERS (username, lastname, password, email) VALUES ("${username}", "${lastname}", "${password}", "${email}");`
  mysqlConnection.query(sql , callback)
}

function getUserLogin(email , callback) {
  const sql = `SELECT * FROM users WHERE email = "${email}"`
  mysqlConnection.query(sql , callback)
}

// function getMessages(callback) {
//   mysqlConnection.query(`
//   SELECT * FROM group_chat`, callback)
// }

// // Fetches all the messages. If channel_id specified, fetches all the messages in that channel.
// function getMessagesChannel(channel_id , callback){
//   const whereStatement = channel_id ? 'WHERE channels.id = ? ' : ''   
//   const sql = `
//               SELECT messages.content AS message , messages.created_time AS time , messages.id AS id , users.full_name AS name , channels.name AS channel_name , channels.id as channel_id , users.id as user_id  FROM messages 
//                   JOIN
//                   user_channel ON user_channel.id = messages.user_channel_id 
//                   JOIN 
//                   channels ON channels.id = user_channel.channel_id
//                   JOIN
//                   users ON users.id = user_channel.user_id
//                   ${
//                       whereStatement
//                   }
//                   ORDER BY messages.created_time ASC;
//                   `
//   console.log(channel_id)
//   channel_id ?  conn.query(sql, [channel_id],(callback)) : mysqlConnection.query(sql, (callback))  
//   return
// }

// function getUserChannels(user_id , callback) {
//   const whereStatement = user_id ? 'WHERE users.id = ? ' : ''
//   const sql = `
//       select users.full_name as name , channels.name as channel_name , channels.id as channel_id , channels.description , user_channel.id AS user_channel_id FROM user_channel
//       JOIN
//       users ON users.id = user_channel.user_id
//       JOIN 
//       channels ON channels.id = user_channel.channel_id
//       ${
//           whereStatement
//       }
//   `
//   return user_id  ? conn.query(sql , [user_id] , callback) : conn.query(sql, callback)
// }

// function createMessage(userChannelId , content , callback ){
//   const sql = `INSERT INTO messages (content , user_channel_id) VALUES (?  , ? )`
//   conn.query(sql , [content , userChannelId] , (err , rows) => {
//       if(err) return callback(err)
//       const id = rows.insertId
//       conn.query('select  content AS message, created_time AS time from messages WHERE id = ? ' , [id] , callback)
//   })
// }

module.exports = { mysqlConnection, getUsersSignUp, getUserLogin};





