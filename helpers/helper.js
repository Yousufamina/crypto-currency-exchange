const nodemailer = require('nodemailer');
// var handlebars = require('handlebars');
var fs = require('fs');
// var pdf = require('html-pdf');

// const csv = require('csv-parser')

var transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
        user: "healthcareproviderlab@gmail.com",
        pass: "HealthcareProvidersLab@1234"
    }
});

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
    }

    // forgotPassword(user, server, key) {
    //
    //     readHTMLFile('./public/template/forgotPassword.html', function (err, html) {
    //
    //         var template = handlebars.compile(html);
    //         var replacements = {
    //             username: user.fullname,
    //             server: server,
    //             key: key,
    //             id: user._id
    //         }
    //         var htmlToSend = template(replacements);
    //
    //         // setup e-mail data with unicode symbols
    //         const mailOptions = {
    //             from: '"HealthCare Providers Laboratory Support" <healthcareproviderlab@gmail.com>', // sender address
    //             to: user.email, // list of receivers
    //             subject: 'Forgot Password Email', // Subject line
    //             text: '', // plaintext body
    //             html: htmlToSend // html body
    //         };
    //
    //         // send mail with defined transport object
    //         transporter.sendMail(mailOptions, (error, info) => {
    //             if (error) {
    //                 return console.log(error);
    //             }
    //             console.log(`Message sent: ${info.response}`);
    //         });
    //     });
    //
    // },

}

module.exports = helper;
