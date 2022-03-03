const UserModel = require("../models/User");
const helper = require("../helpers/helper");
const CONSTANT =  require("../config/constants");
const bcrypt = require("bcryptjs");

const adminController = {

    index: async (request, response) => {
        if (request.session.user) {
            let user = request.session.user;
            response.render('admin/index', {user: user});
        } else {
            response.redirect('/admin/login')
        }
    },

    login: async (request, response) => {
        console.log(" ======================================= Admin login page ======================================= ")
        console.log(" ======================================= " + new Date() + " ======================================= ")
        response.render("admin/login", {status: true, message: ""})
    },

    loginPost: async (req, res) => {
        console.log(" ================== Admin Login Request  ===================")
        console.log(" ======================================= " + new Date() + " ======================================= ")
        console.log("BODY = " + JSON.stringify(req.body));
        const body = JSON.parse(JSON.stringify(req.body));

        try {
            if (body.email && body.password) {
                let user = await UserModel.findOne({email: body.email,type:"Admin"});
                if (user) {
                    const isMatch = await bcrypt.compare(body.password, user.password);
                    if (isMatch) {
                        console.log("match")
                        req.session.user = user;
                        res.redirect("/admin")
                    } else {
                        res.render("admin/login", {status: false, message: "Invalid Password"});
                    }
                } else {
                    res.render("admin/login", {status: false, message: "Email address not exist"});
                }
            }
        } catch (err) {
            console.log(err);
            res
                .status(500)
                .json({errors: {msg: err}});
        }
    },

    logout: async (request, response) => {
        console.log("================== LOGOUT API ====================")
        console.log("================== "+new Date()+" ====================")
        var user = request.session.user;

        delete request.session.user;

        response.redirect('/admin')

    },

    changePassword: async (request, response) => {
        console.log("======  Change Password API =======");
        try {
            let user = await UserModel.findOne({ email: 'admin@admin.com' });
            if (user) {
                // send email
                const key = new Date().getTime();

                await UserModel.updateOne({ "_id": user._id }, {
                    $set: {
                        "key": key
                    }
                });
                const server = CONSTANT.domainUrl;
                const email = CONSTANT.adminEmail;

                await helper.forgotPassword(user, server, key, email);
                response
                    .status(200)
                    .json({ status : true , msg: "You will received email shortly for change password link" });
            }
            else {
                response
                    .status(400)
                    .json({ status : false , msg: "Invalid email address" });
            }
        }
        catch (err) {
            console.log(err);
            response
                .status(500)
                .json({ msg: err });
        }
    },

    showChangePassword: async (request,response) =>{

        console.log("======= Show Change Password API =========");
        console.log(request.query);
        try {
            // check key in db
            let user = await UserModel.findOne({ _id: request.query.u });

            if (user) {
                if (user.key == request.query.k) {
                    // check logic
                    let NowDate = new Date().getTime();
                    let linkDate = request.query.k;
                    let diff = (NowDate - linkDate) / 1000;
                    diff /= (60 * 60);
                    if (diff > 2) {
                        console.log("Link has expired");
                        response.render('changePassword',{status:false,msg:"Link has expired"})
                    }
                    else {
                        response.render('changePassword',{status:true,msg:""})
                    }
                }
                else {
                    console.log("Link has expired");
                    response.render('changePassword',{status:false,msg:"Invalid request or link has expired"})
                }
            }
            else {
                console.log("invalid user || user id not found");
                response.render('changePassword',{status:false,msg:"Invalid request"})

            }
        }
        catch (err) {
            console.log(err);
            response
                .status(500)
                .json({ msg: err });
        }


    },

    updatePassword: async (request, response) => {

        console.log("======  Update Password API =======");
        console.log("=== Body Params: ===" + (JSON.stringify(request.body)));

        try {
            const body = JSON.parse(JSON.stringify(request.body));
            if (body.password == body.confirmPassword) {

                // check key in db
                let user = await UserModel.findOne({ _id: body.userId });

                if (user) {
                    if (user.key == body.key) {
                        // check logic
                        const salt = await bcrypt.genSalt(10);
                        const password = await bcrypt.hash(body.password, salt);
                        let NowDate = new Date().getTime();
                        let linkDate = body.key;
                        let diff = (NowDate - linkDate) / 1000;
                        diff /= (60 * 60);
                        if (diff > 2) {
                            console.log("Link has expired");
                            response
                                .status(400)
                                .json({ msg: "Invalid request or link has expired" });
                            response.render('changePassword',{status:false, msg:"Invalid request or link has expired"})

                        }
                        else {
                            // update password
                            await UserModel.updateOne({ "_id": body.userId }, {
                                $set: {
                                    "password": password, key: ''
                                }
                            });
                            response.render('changePassword',{status:true,msg:"Password has changed successfully"})

                        }
                    }
                    else {
                        console.log("Link has expired");
                        response.render('changePassword',{status:false, msg:"Invalid request or link has expired"})
                    }
                }
                else {
                    console.log("invalid user || user id not found");
                    response.render('changePassword',{status:false, msg:"Invalid request"})
                }
            }
        }
        catch (err) {
            console.log(err);
            response
                .status(500)
                .json({ msg: err });
        }

    },

}

module.exports = adminController;


