const express = require('express');
const app = express();
const port = 3000;
const web = require('./routes/web');
const connectDB = require('./db/connectDB')
var cookieParser = require('cookie-parser')


//Token get from cookie
app.use(cookieParser())
//file upload
const fileUpload = require('express-fileupload')
//tempfile uploader
app.use(fileUpload({useTempFiles:true}))

//connect flash and session
const session = require('express-session')
const flash = require('connect-flash')
//message
app.use(session({
    secret: 'secret',
    cookie: {maxAge:60000},
    resave: false,
    saveUninitialized: false,
}))
//flash message
app.use(flash());

//connect db
connectDB()


//parse application/x-www-form-unlencoded
app.use(express.urlencoded({ extended: false}))


//EJS Set html css
app.set('view engine', 'ejs');
//set public
app.use(express.static('public'));
//route load
app.use("/", web);


//server create
app.listen(port, () => {
    console.log(`server start http://localhost:${port}`);
 });