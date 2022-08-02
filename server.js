const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const api = require("./routes/api");
const admin = require("./routes/admin");
const session = require("express-session");
const multer =  require("multer");
const port = process.env.PORT || 4000;
const app = express();

const connectDB = require("./config/db");
connectDB();

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// app.use('*', cloudinaryConfig);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

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
    res.send("CryptoTrade Server is up and running");
});

app.use('/', api);
app.use('/admin', admin);


const fs = require('fs');
const https = require('https');
const httpsServer = https.createServer({
       key: fs.readFileSync('/etc/letsencrypt/live/gogamble.app/privkey.pem'),
       cert: fs.readFileSync('/etc/letsencrypt/live/gogamble.app/fullchain.pem'),
}, app);

httpsServer.listen(port, () => {
    console.log("CryptoTrade HTTPS SERVER Listening at port : " + port);
});
