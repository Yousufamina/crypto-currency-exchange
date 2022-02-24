const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const api = require("./routes/api");
const admin = require("./routes/admin");
const session = require("express-session");
// const multer =  require("multer");
const port = process.env.PORT || 4000;
const app = express();
const { uploader, cloudinaryConfig } = require("./config/cloudinaryConfig");

const multer = require("multer");
const storage = multer.memoryStorage();
const connectDB = require("./config/db");
connectDB();

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('*', cloudinaryConfig);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(session({ secret : '1234567890QWERTY' }));
app.use(multer({ storage }).single('image'));

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*")
    res.header("Access-Control-Allow-Headers", "Origin, token, X-Requested-With, Content-Type, Accept");
    next();
});

// // error handler
/* eslint no-unused-vars: 0 */
app.use((err, req, res, next) => {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
    // render the error page
    res.status(err.status || 500);
    res.render('error');
});


app.get("/", (req, res) => {
    res.send("Server is up and running");
});

app.use('/', api);
app.use('/admin', admin);


app.listen(port, () => {
    console.log("SERVER Listening at port : " + port);
});
