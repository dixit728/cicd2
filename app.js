// require module
var express = require('express');
var http = require('http');
var ejs = require('ejs');
var flash = require("connect-flash");
var cookieParser = require("cookie-parser");
var session = require("express-session");
var OgData = require("./config/Og.json"); // short type info related to blog
let connectDB = require("./config/connection"); // Connnection class

// Creating the application
var app = express();

//view engine 
app.set('view engine', 'ejs');

//assign port number
let port = 2100 | process.env.port;
process.env.TOKEN_SECRET = require("crypto").randomBytes(64).toString('hex');

//Add some required packages
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(flash());
app.use(cookieParser("Pawan "));
app.use(session({
    cookie: { maxAge: 3600000 },
    secret: "I dont know what to know",
    resave: false,
    saveUninitialized: false
}));

// Middleware
app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    var token = req.cookies.token;
    var UserName = req.cookies.UserName;
    var atoken = req.cookies.atoken;
    var AdminName = req.cookies.AdminName;
    if (token == null) {
        res.locals.is_User = false;
        res.locals.User = "";
        res.locals.UserName = "";
    } else {
        res.locals.User = token;
        res.locals.UserName = UserName;
        res.locals.is_User = true;
    }
    if (atoken == null) {
        res.locals.is_Admin = false;
        res.locals.admin = "";
        res.locals.AdminName = "";
    } else {
        res.locals.admin = atoken;
        res.locals.AdminName = AdminName;
        res.locals.is_Admin = true;
    }
    next();
});

// All Public Folder
app.use("/images", express.static(__dirname + '/Public/images')); // website images
app.use("/upimages", express.static(__dirname + '/Public/uploads')); // Where your new blog's images saved
app.use("/CSS", express.static(__dirname + '/Public/CSS/style1.css'));
app.use("/CSS1", express.static(__dirname + '/Public/CSS/style2.css'));

//Route to website (USER)
app.use('/user', require("./routes/WebSiteRoute/userroutes.js")); // Login, Signup and Profile Page
app.use('/blog', require("./routes/WebSiteRoute/blogroute.js")); // All blogs, Blog(rm), Add blog
app.use('/', require("./routes/WebSiteRoute/mainpageroutes.js")); // Home, Contact and About
app.use('/', require("./routes/WebSiteRoute/emailroute.js")); // Send thank you for request


// Route to Website (Admin)
app.use("/Admin/Blog", require("./routes/AdminRoute/blogroute")); // 
app.use("/Admin", require("./routes/AdminRoute/mainpageroutes"));


// Route to Error Page (If any page is not load successfully )
app.get("/*", (req, res) => {
    OgData.title = "Error 404";
    OgData.description = "";
    res.status(404).render("../views/WebSite/mainpages/error404.ejs", { title: "Error 404 ", Og: OgData });
});

// start server 
http.createServer(app).listen(port, () => {
    console.log("port number =" + port);
});