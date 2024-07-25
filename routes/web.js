const express = require('express');
const FrontController = require('../controllers/FrontController');
const CourseController = require('../controllers/CourseController');
const route = express.Router()
const checkUseAuth = require('../middleware/auth');
const authRoles = require('../middleware/adminrole');
const isLogin = require('../middleware/isLogin');
const AdminController = require('../controllers/AdminController');



//route localhost:3000('/')
route.get("/", isLogin, FrontController.login);
route.get("/register", FrontController.register);
route.get("/home", checkUseAuth, FrontController.home);
route.get("/about",checkUseAuth, FrontController.about);
route.get("/contact" ,checkUseAuth, FrontController.contact);
route.post("/insertUser",FrontController.insertUser)
route.post("/verifyLogin",FrontController.verifyLogin)
route.get("/logout", FrontController.logout)
route.get("/profile", checkUseAuth, FrontController.profile)
route.post('/updateProfile',checkUseAuth,FrontController.updateProfile)
route.post('/changePassword',checkUseAuth,FrontController.changePassword)
route.get('/verify', FrontController.verifyMail)
route.get('/forgotPassword', FrontController.forgotPassword)
route.post('/forget_password',FrontController.forgetPasswordVerify)
route.get('/reset-password',FrontController.resetPassword)
route.post('/reset_Password1',FrontController.reset_Password1)

//coursecontroller
route.post("/courseInsert",checkUseAuth, CourseController.courseInsert)
route.get("/courseDisplay", checkUseAuth, CourseController.courseDisplay)
route.get("/courseView/:id", checkUseAuth, CourseController.courseView)
route.get("/courseEdit/:id", checkUseAuth, CourseController.courseEdit)
route.get("/courseDel/:id", checkUseAuth, CourseController.courseDel)
route.post("/courseUpdate/:id", checkUseAuth, CourseController.courseUpdate)


//admin part
route.get("/admin/dashboard", checkUseAuth, authRoles('admin'), AdminController.dashboard)
route.get("/admin/courseDisplay" ,checkUseAuth, authRoles('admin'),  AdminController.display)
route.get("/adminView/:id",checkUseAuth, authRoles('admin'), AdminController.adminView)
route.get("/adminEdit/:id" ,checkUseAuth, authRoles('admin'), AdminController.adminEdit)
route.get("/adminDel/:id", checkUseAuth, authRoles('admin'), AdminController.adminDel)
route.post("/update_status/:id" ,checkUseAuth, authRoles('admin'), AdminController.updatestatus)
route.get("/admin/chngpass", checkUseAuth, authRoles('admin'), AdminController.chngpass)
route.post("/upadmPassword", checkUseAuth, authRoles('admin'), AdminController.upadmPassword)
route.get("/admin/admProfile" ,checkUseAuth, authRoles('admin'), AdminController.admProfile)
route.post("/upadmProfile", checkUseAuth, authRoles('admin'), AdminController.upadmProfile)

module.exports= route;