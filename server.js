const express = require('express')
const net = require('net')
const fs = require('fs')
const app = express()
const bcrypt = require('bcrypt')
const register = require('./routes/register')
const path = require('path')
const session = require('express-session')
const bodyParser = require('body-parser')
const Pusher = require('Pusher')
const port = 3001
const db = require('mysql')
const { constants } = require('crypto')
var con = db.createConnection({
    host: "localhost",
    user: "root",
    password: "0218595Mm",
    database: "noderegister2"
})

/**
 * Pusher Below
 */
const pusher = new Pusher({
 appId: "1059847",
 key: "5e541d4d4c6cbfec4c19",   
 secret: "3f087977e9dc8c2f1cac",
 cluster: "ap2"
})

/**
 * EXPRESS BELOW
 */

          fs.readFile('./Public/root/home.html', (err, html) => {
     if(err) throw err;
     app.get('/home.html', (req, res) => {
         res.writeHead(200, {"Content-Type": "text/html"})
         res.write(html)
         res.end()
     })
 })
fs.readFile('./Public/root/index.html', (err, html) => {
    if(err) throw err

        app.get('/index.html', (req, res) => {
            res.writeHead(200, {"Content-Type": "text/html"})
            res.write(html)
            res.end()
        })

    app.get('/', (req, res) => {
        res.writeHead(200, {"Content-Type": "text/html"})
        res.write(html)
        res.end()
           })
})
fs.readFile('./Public/root/register.html', (err, html) => {
    if(err) throw err;
    app.get('/register.html', (req, res) => {
        res.writeHead(200, {"Content-Type": "text/html"})
        res.write(html)
        res.end
    })
})

fs.readFile('./Public/root/about.html', (err, html) => {
    if(err) throw err;
    app.get('/about.html', (req, res) => {
        res.writeHead(200, {"Content-Type": "text/html"})
        res.write(html)
        res.end
    })
})
fs.readFile('./Public/root/login.html', (err, html) => {
    if (err) throw err;
    app.get('/login.html', (req, res) => {
        res.writeHead(200, {"Content-Type": "text/html"})
        res.write(html)
        res.end()
    }) 
})
app.use(express.static(path.join(__dirname, "Public")))
app.listen(port, () => {
    console.log(`listening at port: ${port}`)
})

/**
 * MYSQL BELOW
 */

con.connect(err => {
    if(err) throw err;
    console.log('connected')
   
})


/**
 * Login Module Below.
 */app.use(session({
	secret: 'yeah_right',
	resave: true,
    saveUninitialized: true,
}));

app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());

app.post('/regis', register.register)
app.post('/auth', (req, res) => {
    var username = req.body.username;
    req.session.username = username;
    var password = req.body.password;
   
    console.log("gey")
    con.query('SELECT * FROM users WHERE username = ?', [username], async (err, resu, fields) => {
      console.log("fre sha vaca doo")
        if (err) {
          
            resu.send({
              "code":400,
              "failed":"error ocurred"
            })
           
          }else{
            if(resu.length >0){
              const comparision = await bcrypt.compare(password, resu[0].password)
              if(comparision){
                req.session.loggedin = true              

                res.redirect('/dashboard')
                  console.log(req.session.loggedin)
                }
              else{
                req.session.loggedin = false;
                res.send({
                     "code":204,
                     "success":"Username and password do not match."
                })
              }
            }
            else{
              req.session.loggedin = false;
              res.send({
                "code":206,
                "success":"Username does not exist"
                  });
            }
          }
    })
})

app.get('/dashboard', (req, res) => {
    console.log(req.session.loggedin)
    if(req.session.loggedin) {
        res.send(`Welcome back ${req.session.username} !`)
    } else {
res.send('Please login to view this page')
    }
    res.end()
})