const express = require("express");
const router = express.Router();
// const auth = require("../middleware/auth");
const adminController = require("../controllers/adminController");
const userController = require("../controllers/UsersController");
const middleware = require("../middleware/middleware");

/*
 user API
 */
router.get('/login', adminController.login);
router.get('/',middleware.admin ,adminController.index);
router.post('/login',adminController.loginPost);
router.get('/logout',adminController.logout);
router.get('/sendChangePasswordRequest',adminController.changePassword);
router.get('/changePassword',adminController.showChangePassword);
router.post('/changePassword',adminController.updatePassword);

// create Admin User
router.post('/createAdminUser', userController.createUser);


module.exports = router;