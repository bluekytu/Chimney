const sql = require('mysql')
const bcrypt = require('bcrypt')
const saltRounds = 10;
const session = require('express-session')
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
var con = sql.createConnection({
    host : "localhost",
    user : "root",
    password : "0218595Mm",
    database : "noderegister2"

})
app.use(session({
	secret: 'yeah_right',
	resave: true,
    saveUninitialized: true,
}));

app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());

con.connect((err) => {
    if(err){
        throw err
    } else {
    console.log('connected to noderegister')
    }

})
exports.register = async function(req, res) {
    const passworda = req.body.password;
    const encryptedPassword = await bcrypt.hash(passworda, saltRounds)
    var users = {
      "username": req.body.username,
        "email": req.body.email,
        "password": encryptedPassword
    }
con.query('INSERT INTO users SET ?', users, (err, resu, fields) => {
    if (err) {
      console.log(err)
        res.send({
          "code":400,
          "failed":"error ocurred"
        })
      } else {
        res.redirect('/login.html')
        }
})
}
