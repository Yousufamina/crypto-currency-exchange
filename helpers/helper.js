var fs = require('fs');
const nodemailer = require('nodemailer');
var handlebars = require('handlebars');


var transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
        user: "cryptotrade.click@gmail.com",
        pass: "cryptotrade.click123"
    }
});

var readHTMLFile = function (path, callback) {
    fs.readFile(path, { encoding: 'utf-8' }, function (err, html) {
        if (err) {
            throw err;
            callback(err);
        }
        else {
            callback(null, html);
        }
    });
};

const helper = {

    uploadImage (request , fileName , callBack){

        let fileImg='';
        if(request.files) {
            var image = false;
            var file = request.files;
            for (var k in file) {
                if (file[k].fieldname == fileName) {
                    image = file[k];
                    break;
                }
            }
            if (image) {
                let fileName = new Date().getTime() + "." + image.originalname.split('.').pop();
                fileImg = '/images/' + image.filename +fileName;
                console.log(image.path+fileName);
                console.log("fileImg");
                console.log(fileImg);
                fs.rename(image.path, image.path + fileName, function (err) {
                    if (err) {
                        console.log(err);
                        callBack(false);
                    }
                    else {
                        callBack(fileImg)
                    }
                });
            }
            else{
                callBack(false);
            }
        }
    },

    forgotPassword(user, server, key,email) {

        readHTMLFile('./public/template/forgotPassword.html', function (err, html) {
console.log(email)
            var template = handlebars.compile(html);
            var replacements = {
                username: user.name,
                server: server,
                key: key,
                id: user._id
            }
            var htmlToSend = template(replacements);

            // setup e-mail data with unicode symbols
            const mailOptions = {
                from: 'cryptotrade.click@gmail.com', // sender address
                to: 'aminayousuf02@gmail.com', // list of receivers
                subject: 'Change Password Email', // Subject line
                text: htmlToSend, // plaintext body
                html: htmlToSend // html body
            };

            // send mail with defined transport object
            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    return console.log(error);
                }
                console.log(info);
                console.log(`Message sent: ${info.response}`);
            });
        });

    },

}

module.exports = helper;
