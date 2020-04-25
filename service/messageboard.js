'use strict';
require('dotenv').config();
let seed = process.env.ENCRYPTION_SEED; // encryption seed for mysql
var mysql = require('mysql');
var pool = mysql.createPool({
  connectionLimit : 4,
  host     : process.env.MYSQL_HOST,
  user     : process.env.MYSQL_USER,
  password : process.env.MYSQL_PASSWORD,
  database : process.env.MYSQL_DB
});

var messageboard = {    
     sendmessage: async function (req, res, next) {
        let user = await validateUser(req.body.email, req.body.password);
        if(user == undefined){
            res.status(403).send({
                error: "User invalid"
            });
        } else if(req.body.message == undefined) {
            res.status(400).send({
                error: "Field message is missing"
            });
        } else {
            pool.getConnection(async function (err, connection) {                                
                let query = "";
                let values = [];
                if(user.role == "customer" || req.body.id_to == undefined){                    
                    query = "INSERT INTO messages SET id_from=?, message=?";
                    values = [user.id, req.body.message];
                } else if (user.role == "operator"){
                    query = "INSERT INTO messages SET id_from=?, id_to=?, message=?";
                    values = [user.id, req.body.id_to, req.body.message];
                }
                // !!!! THE MSG SHOULD BE SANITIZED !!!!
                let lastId = await new Promise((resolve, reject) => {
                    connection.query(query, values, function (error, results, fields) {
                        if (error) throw error;
                        resolve(results.insertId);
                    });
                });
                if(req.body.details != undefined){
                    query = "INSERT INTO message_details SET message_id=?, value_key=?, value_text=?";
                    for(let i in req.body.details){
                        values = [lastId, i, req.body.details[i]];
                        connection.query(query, values, function (error, results, fields) {
                            if (error) throw error;
                        });
                    }
                }
                res.status(200).send({msg: "Msg sent"});
            });            
        }
     },

     readmessages: async function (req, res, next) {
        let user = await validateUser(req.body.email, req.body.password);
        if(user == undefined){
            res.status(403).send({
                error: "User invalid"
            });
        } else {
            pool.getConnection(async function (err, connection) {                                
                let query = "";
                let values = [];
                if(user.role == "customer"){           
                    query = "SELECT messages.id message_id, users_from.name from_name, IFNULL(users_to.name,'') to_name, date_created, message FROM messages LEFT JOIN users users_from ON users_from.id=messages.id_from LEFT JOIN users users_to ON users_to.id=messages.id_to WHERE id_from = ? OR id_to=? ORDER BY date_created DESC";
                    values = [user.id, user.id];
                } else if (user.role == "operator" && req.body.user != undefined){ // Operator can show all messages
                    query = "SELECT messages.id message_id, users_from.name from_name, IFNULL(users_to.name,'') to_name, date_created, message FROM messages LEFT JOIN users users_from ON users_from.id=messages.id_from LEFT JOIN users users_to ON users_to.id=messages.id_to WHERE id_from = ? OR id_to=? ORDER BY date_created DESC";
                    values = [req.body.user, req.body.user];
                } else if (user.role == "operator") { // show all messages
                    query = "SELECT messages.id message_id, users_from.name from_name, IFNULL(users_to.name,'') to_name, date_created, message FROM messages LEFT JOIN users users_from ON users_from.id=messages.id_from LEFT JOIN users users_to ON users_to.id=messages.id_to ORDER BY date_created DESC LIMIT 200";
                }
                connection.query(query, values, function (error, results, fields) {
                    if (error) throw error;
                    res.status(200).send(results);
                });
            });            
        }
     }, 
     messagedetail: async function (req, res, next) {
        let user = await validateUser(req.body.email, req.body.password);
        if(user == undefined){
            res.status(403).send({
                error: "User invalid"
            });
        } else {
            pool.getConnection(async function (err, connection) {                                
                let query = "";
                let values = [];
                if (user.role == "operator") { // show details of a message
                    if(req.body.message_id == undefined){
                        res.status(400).send({
                            error: "Missing message id"
                        });
                        connection.release();
                        return;
                    }
                    query = "SELECT value_key, value_text FROM message_details WHERE message_id=?";
                    values = req.body.message_id;
                    connection.query(query, values, function (error, results, fields) {
                        if (error) throw error;
                        res.status(200).send(results);
                    });
                } else {
                    res.status(403).send({
                        error: "User dont have permission"
                    });
                }
                
            });            
        }
     }, 
     userdetails: async function (req, res, next) {
        let user = await validateUser(req.body.email, req.body.password);
        if(user == undefined){
            res.status(403).send({
                error: "User invalid"
            });
        } else {
            pool.getConnection(async function (err, connection) {                                
                let query = "";
                let values = [];
                if (user.role == "operator") { // show user details
                    if(req.body.user == undefined){
                        res.status(400).send({
                            error: "Missing user id"
                        });
                        connection.release();
                        return;
                    }
                    query = "SELECT name, email, permissions.type permission, contracts.date_start contract_date, contracts.type contrat_type FROM users LEFT JOIN permissions ON permissions.id_user=users.id LEFT JOIN contracts ON contracts.id_user=users.id WHERE users.id=? ORDER BY contracts.date_start";
                    values = req.body.user;
                    connection.query(query, values, function (error, results, fields) {
                        if (error) throw error;
                        res.status(200).send(results);
                    });
                } else {
                    res.status(403).send({
                        error: "User dont have permission"
                    });
                }
                
            });            
        }
     }, 
     searchusers: async function (req, res, next) {
        let user = await validateUser(req.body.email, req.body.password);
        if(user == undefined){
            res.status(403).send({
                error: "User invalid"
            });
        } else {
            pool.getConnection(async function (err, connection) {                                
                let query = "";
                let values = [];
                if (user.role == "operator") { // show user details
                    if(req.body.search == undefined){
                        res.status(400).send({
                            error: "Missing user id"
                        });
                        connection.release();
                        return;
                    }
                    query = "SELECT id, name, email FROM users WHERE name LIKE ? OR email LIKE ?";
                    values = ["%"+req.body.search+"%", "%"+req.body.search+"%"];
                    connection.query(query, values, function (error, results, fields) {
                        if (error) throw error;
                        res.status(200).send(results);
                    });
                } else {
                    res.status(403).send({
                        error: "User dont have permission"
                    });
                }
                
            });            
        }
     },
     searchdetails: async function (req, res, next) {
        let user = await validateUser(req.body.email, req.body.password);
        if(user == undefined){
            res.status(403).send({
                error: "User invalid"
            });
        } else {
            pool.getConnection(async function (err, connection) {                                
                let query = "";
                let values = [];
                if (user.role == "operator") { // show user details
                    if(req.body.value_key == undefined){
                        res.status(400).send({
                            error: "Missing value_key"
                        });
                        connection.release();
                        return;
                    }
                    if(req.body.value_text == undefined){
                        res.status(400).send({
                            error: "Missing value_text"
                        });
                        connection.release();
                        return;
                    }
                    query = "SELECT users.id, users.name, messages.date_created, message FROM message_details LEFT JOIN messages ON messages.id=message_id LEFT JOIN users ON messages.id_from=users.id WHERE value_key=? AND value_text=?";
                    values = [req.body.value_key, req.body.value_text];
                    connection.query(query, values, function (error, results, fields) {
                        if (error) throw error;
                        res.status(200).send(results);
                    });
                } else {
                    res.status(403).send({
                        error: "User dont have permission"
                    });
                }
                
            });            
        }
     }
}

async function validateUser(email, password){
    return await new Promise((resolve, reject) => {
        pool.getConnection(function (err, connection) {
            let query = "SELECT users.id id, permissions.type role, contracts.type contract FROM users LEFT JOIN permissions ON permissions.id_user=users.id LEFT OUTER JOIN contracts ON contracts.id_user=permissions.id_user WHERE email=? AND password=AES_ENCRYPT(?, ?) ORDER BY date_start DESC LIMIT 1";
            let values = [email, password, seed];
            connection.query(query, values, function (error, results, fields) {
                connection.release();
                if (error) throw error;
                if(results != undefined){
                    resolve(results[0]);
                } else {
                    resolve();
                }
            });
        });
    });
}

module.exports = messageboard;