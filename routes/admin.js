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
router.post('/forgotPassword',adminController.forgotPassword);
router.post('/changePassword/:id/:key',adminController.changePassword);

// create Admin User
router.post('/createAdminUser', userController.createUser);



module.exports = router;