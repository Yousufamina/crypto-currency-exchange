
const UserModel = require("../models/User");
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

    forgotPassword: async (request, response) => {

        console.log("======  Forgot Password API =======");
        console.log("=== Body Params: ===" + (JSON.stringify(request.body)));

        try {
            const body = JSON.parse(JSON.stringify(request.body));
            let user = await EmployeeModel.findOne({ email: body.email });
            if (user) {
                // send email
                const key = new Date().getTime();

                await EmployeeModel.updateOne({ "_id": user._id }, {
                    $set: {
                        "key": key
                    }
                });
                const server = CONSTANT.domainUrl;

                await helper.forgotPassword(user, server, key);
                response
                    .status(200)
                    .json({ msg: "You will received email shortly" });
            }
            else {
                response
                    .status(400)
                    .json({ msg: "Invalid email address" });
            }
        }
        catch (err) {
            console.log(err);
            response
                .status(500)
                .json({ msg: err });
        }
    },

    changePassword: async (request, response) => {

        console.log("======  Forgot Password API =======");
        // console.log("=== Body Params: ===" + (JSON.stringify(request.body)));

        try {
            const body = JSON.parse(JSON.stringify(request.body));
            if (body.password == body.confirm_password) {

                // check key in db
                let user = await EmployeeModel.findOne({ _id: request.params.id });

                if (user) {
                    if (user.key == request.params.key) {
                        // check logic
                        const salt = await bcrypt.genSalt(10);
                        const password = await bcrypt.hash(body.password, salt);
                        let NowDate = new Date().getTime();
                        let linkDate = request.params.key;
                        let diff = (NowDate - linkDate) / 1000;
                        diff /= (60 * 60);
                        if (diff > 2) {
                            console.log("Link has expired");
                            response
                                .status(400)
                                .json({ msg: "Invalid request or link has expired" });
                        }
                        else {
                            // update password
                            await EmployeeModel.updateOne({ "_id": request.params.id }, {
                                $set: {
                                    "password": password, key: ''
                                }
                            });
                            response
                                .status(200)
                                .json({ msg: "Password has changed successfully" });
                        }
                    }
                    else {
                        console.log("Link has expired");
                        response
                            .status(400)
                            .json({ msg: "Invalid request or link has expired" });
                    }
                }
                else {
                    console.log("invalid user || user id not found");
                    response
                        .status(400)
                        .json({ msg: "Invalid request" });
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


