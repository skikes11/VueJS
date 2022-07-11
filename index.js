const passport = require('passport');
const express = require("express");

require('./controllers/passport')(passport);
const session = require('express-session');
const cors = require("cors");
const app = express();
const mongoose = require("mongoose");
var bodyParser = require("body-parser");
const morgan = require("morgan");
const dotenv = require("dotenv");
const myRouter = require("./routes/index");
const viewRouter = require("./routes/viewRouter");
const homeRouter = require("./routes/homeRouter")
const cookieParser = require('cookie-parser');
var flash = require('connect-flash');
dotenv.config();    
//connect database
mongoose.connect((process.env.MONGODB_URL),()=>{
    console.log("connected database");
});



app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// app.use(express.urlencoded({ extended: true }));
 app.use(express.json());


app.use(bodyParser.json());


app.use(session({secret: 'ilovescodetheworld'})); // chuối bí mật đã mã hóa coookie
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session



app.use(cookieParser());


app.use(bodyParser.urlencoded({ extended: true }))
//Static files
app.use(express.static(__dirname + '/public'));

// cau hinh engine ejs
app.set("view engine", "ejs");
app.set("views","./view");

app.use('/static', express.static('public'))

app.use(cors());
app.use(morgan("common"));  

// API
app.use("/api", myRouter);   
app.use("/", homeRouter);
app.use("/", viewRouter);

// app.use("/userInfor", userInforRoute);
        
app.listen(8000, ()=>{
    console.log("Server is running..");
})