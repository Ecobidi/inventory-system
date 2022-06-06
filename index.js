require('dotenv').config({path: __dirname + '/.env'})
const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const expressSession = require("express-session");
// const fileUpload = require("express-fileupload");
const flash = require("connect-flash");
const mongoose =require("mongoose");

const config = require("./config");

// routes
const productRoute = require("./routes/product");
const categoryRoute = require("./routes/category");
const staffRoute = require("./routes/staff");
const invoiceRoute = require("./routes/invoice");
const pagesRoute = require("./routes/pages");

// models
const Staff = require("./models/staff");

// // mongoose connection
// mongoose.connect(config.dbPath);

// mongoose.connection.once("connected", () => console.log("Connected to database"));

// mongoose.connection.on("error", (err) => console.log("Mongoose connection error: " + err));

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.qmunc.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`

try {
  mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  console.log('connected to database: ' + process.env.DB_NAME)
} catch (error) {
  console.log('Error connecting to database: ' + process.env.DB_NAME)
  console.log(error)
}


let app = express();


//express-static middleware
app.use(express.static(path.join(__dirname, "public")));

// middlewares
// ejs middleware
app.set("view engine", "ejs");
// body-parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
// express-fileUpload middleware
// app.use(fileUpload());
// express-session middleware
app.use(expressSession({
  secret: "282818112",
  resave: false,
  saveUninitialized: true,
}));
// connect-flash middleware
app.use(flash());

// global variables
app.use(function(req, res, next) {
  res.locals.author = config.author;
  res.locals.user = req.session.user || { username: 'test' };
  res.locals.error = req.flash("error");
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  res.locals.productImageDir = config.productImageDir;
  res.locals.categoryImageDir = config.categoryImageDir;
  app.locals.appname = config.appName
  app.locals.owner = config.author
  app.locals.matno = config.matNo

  if (req.session.user) {
    let username = req.session.user.username
    switch(username) {
      case 'vicky':
        app.locals.appname = 'Pharmacy Inventory'
        break;
    }
  }

  next();
});

app.get('/login', (req, res) => res.render('login'));

app.post("/login", function(req, res) {
  Staff.findOne({staffid: req.body.staffid}, (err, user) => {
    if (err) return console.log(err);
    if(user && user.password == req.body.password) {
      req.session.user = user;
      res.redirect("/pages")
    } else {
      req.flash("error_msg", "Incorrect Login Details")
      res.redirect("/login");
    }
  });
});

app.use("/", (req, res, next) => {
  if (req.session.user) {
    next()
  } else {
    res.redirect("/login")
  }
})

app.get('/logout', (req, res) => {
  req.session.user = null;
  res.redirect('/login');
})

app.get('/', (req, res) => res.redirect('/pages'))

app.get('/dashboard', (req, res) => res.redirect('/pages'));

app.get('/pos', (req, res) => res.redirect('/pages/sales'));

// routes
app.use("/pages", pagesRoute);
app.use("/products", productRoute);
app.use("/invoices", invoiceRoute)
app.use("/categories", categoryRoute);
app.use("/staff", staffRoute);

// listen to port
app.listen(process.env.PORT, () => { console.log(config.appName + " running on port " + process.env.PORT); });