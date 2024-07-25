const UserModel = require("../models/user");
const TeacherMOdel = require("../models/teacher");
const CourseModel = require("../models/course");
const bcrypt = require("bcrypt");
const cloudinary = require("cloudinary");
const jwt = require("jsonwebtoken");
const nodeMailer = require("nodemailer");
const randomstring = require("randomstring");
cloudinary.config({
  cloud_name: "djjzy96fu",
  api_key: "248116893734283",
  api_secret: "sX9x4jLJxgMuqx97qKZPwUBWxd4",
});

class FrontController {
  static login = async (req, res) => {
    try {
      res.render("login", {
        msg: req.flash("success"),
        msg1: req.flash("error"),
      });
    } catch (error) {
      console.log(error);
    }
  };
  static register = async (req, res) => {
    try {
      res.render("register", { msg: req.flash("error") });
    } catch (error) {
      console.log(error);
    }
  };
  static home = async (req, res) => {
    try {
      const { name, email, image, id, role } = req.data;
      const btech = await CourseModel.findOne({
        user_id: id,
        course: "B.Tech",
      });
      const bca = await CourseModel.findOne({ user_id: id, course: "BCA" });
      const mca = await CourseModel.findOne({ user_id: id, course: "MCA" });
      res.render("Home", {
        uname: name,
        image: image,
        umail: email,
        btech: btech,
        bca: bca,
        mca: mca,
        r: role,
      });
    } catch (error) {
      console.log(error);
    }
  };
  static about = async (req, res) => {
    try {
      const { name, email, image } = req.data;
      res.render("About", { uname: name, image: image });
    } catch (error) {
      console.log(error);
    }
  };
  static contact = async (req, res) => {
    try {
      const { name, email, image } = req.data;
      res.render("Contact", { uname: name, image: image });
    } catch (error) {
      console.log(error);
    }
  };
  static logout = async (req, res) => {
    try {
      res.clearCookie("Token");
      res.redirect("/");
    } catch (error) {
      console.log(error);
    }
  };
  //user data insert
  static insertUser = async (req, res) => {
    try {
      // console.log(req.files.image)
      const file = req.files.image;
      //image upload cloudianry
      const imageUpload = await cloudinary.uploader.upload(file.tempFilePath, {
        folder: "userProfile",
      });
      // console.log(imageUpload)
      const { uname, umail, upass, ucpass } = req.body;
      const user = await UserModel.findOne({ email: umail });
      // console.log(user)
      if (user) {
        req.flash("error", "Email Already exists.");
        res.redirect("/register");
      } else {
        if (uname && umail && upass && ucpass) {
          if (upass === ucpass) {
            const hashPassword = await bcrypt.hash(upass, 10);
            const result = new UserModel({
              name: uname,
              email: umail,
              password: hashPassword,
              image: {
                public_id: imageUpload.public_id,
                url: imageUpload.secure_url,
              },
            });
            const userdata = await result.save();
            if (userdata) {
              var token = jwt.sign({ ID: userdata._id }, "Aditya@1234");
              // console.log(token)
              res.cookie("Token", token);
              this.sendVerifymail(uname, umail, userdata._id);
              //To redirect to login page
              req.flash(
                "error",
                "Your Registration has been successfully.Please verify your mail. ."
              );
              res.redirect("/register");
            } else {
              req.flash("error", "Not Register.");
              res.redirect("/register");
            }
            req.flash("success", "Register successfully please Login.");
            res.redirect("/"); //url
          } else {
            req.flash("error", "Pasword and Confirm Password does not match.");
            res.redirect("/register");
          }
        } else {
          req.flash("error", "All Fields Are Required.");
          res.redirect("/register");
        }
      }
    } catch (error) {
      console.log(error);
    }
  };
  static verifyLogin = async (req, res) => {
    try {
      // console.log(req.body)
      const { email, password } = req.body;
      const user = await UserModel.findOne({ email: email });
      // console.log(user)
      if (user != null) {
        const isMatch = await bcrypt.compare(password, user.password);
        // console.log(isMatch)
        if (isMatch) {
          if (user.role == "user" && user.is_verified == 1) {
            var token = jwt.sign({ ID: user._id }, "Aditya@1234");
            // console.log(token)
            res.cookie("Token", token);
            res.redirect("/home");
          } else if (user.role == "admin" && user.is_verified == 1) {
            var token = jwt.sign({ ID: user._id }, "Aditya@1234");
            // console.log(token)
            res.cookie("Token", token);
            res.redirect("admin/dashboard");
          } else {
            req.flash("error", "Please verify your email address.");
            res.redirect("/");
          }
        } else {
          req.flash("error", "Invalid Username & Password.");
          res.redirect("/");
        }
      } else {
        req.flash("error", "You are not a registered user.");
        res.redirect("/");
      }
    } catch (error) {
      console.log(error);
    }
  };
  // profile
  static profile = (req, res) => {
    try {
      const { name, email, image, contact } = req.data;
      res.render("profile", {
        uname: name,
        image: image,
        email: email,
        mobile_no: contact,
      });
    } catch (error) {
      console.log(error);
    }
  };
  static changePassword = async (req, res) => {
    try {
      const { id } = req.data;
      //console.log(req.body)
      const { op, np, cp } = req.body;
      if (op && np && cp) {
        const user = await UserModel.findById(id);
        const isMatched = await bcrypt.compare(op, user.password);
        //console.log(isMatched)
        if (!isMatched) {
          req.flash("error", "Current password is incorrect ");
          res.redirect("/profile");
        } else {
          if (np != cp) {
            req.flash("error", "Password does not match");
            res.redirect("/profile");
          } else {
            const newHashPassword = await bcrypt.hash(np, 10);
            await UserModel.findByIdAndUpdate(id, {
              password: newHashPassword,
            });
            req.flash("success", "Password Updated successfully ");
            res.redirect("/");
          }
        }
      } else {
        req.flash("error", "ALL fields are required ");
        res.redirect("/profile");
      }
    } catch (error) {
      console.log(error);
    }
  };
  static updateProfile = async (req, res) => {
    try {
      const { id } = req.data;
      const { name, email, role } = req.body;
      if (req.files) {
        const user = await UserModel.findById(id);
        const imageID = user.image.public_id;
        // console.log(imageID);

        //deleting image from Cloudinary
        await cloudinary.uploader.destroy(imageID);
        //new image update
        const imagefile = req.files.image;
        const imageupload = await cloudinary.uploader.upload(
          imagefile.tempFilePath,
          {
            folder: "userProfile",
          }
        );
        var data = {
          name: name,
          email: email,
          image: {
            public_id: imageupload.public_id,
            url: imageupload.secure_url,
          },
        };
      } else {
        var data = {
          name: name,
          email: email,
        };
      }
      await UserModel.findByIdAndUpdate(id, data);
      req.flash("success", "Update Profile successfully");
      res.redirect("/profile");
    } catch (error) {
      console.log(error);
    }
  };
  static sendVerifymail = async (uname, umail, user_id) => {
    //console.log(name, email, user_id);
    // connenct with the smtp server

    let transporter = await nodeMailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,

      auth: {
        user: "adityachaturveditaekwondo@gmail.com",
        pass: "vxtcmicuuamvowwp",
      },
    });
    let info = await transporter.sendMail({
      from: "test@gmail.com", // sender address
      to: umail, // list of receivers
      subject: "For Verification mail", // Subject line
      text: "hello", // plain text body
      html:
        "<p>Hii " +
        uname +
        ',Please click here to <a href="http://localhost:3000/verify?id=' +
        user_id +
        '">Verify</a>Your mail</p>.',
    });
    //console.log(info);
  };
  static verifyMail = async (req, res) => {
    try {
      const updateinfo = await UserModel.findByIdAndUpdate(req.query.id, {
        is_verified: 1,
      });
      if (updateinfo) {
        res.redirect("/home");
      }
    } catch (error) {
      console.log(error);
    }
  };
  static forgotPassword = async (req, res) => {
    try {
      res.render("forgotPassword", { msg: req.flash("error") });
    } catch (error) {
      console.log(error);
    }
  };
  static forgetPasswordVerify = async (req, res) => {
    try {
      const { email } = req.body;
      const userData = await UserModel.findOne({ email: email });
      //console.log(userData)
      if (userData) {
        const randomString = randomstring.generate();
        // console.log(randomString)
        await UserModel.updateOne(
          { email: email },
          { $set: { token: randomString } }
        );
        this.sendEmail(userData.name, userData.email, randomString);
        req.flash("success", "Please, Check Your mail to reset Your Password!");
        res.redirect("/");
      } else {
        req.flash("error", "You are not a registered Email");
        res.redirect("forgotPassword");
      }
    } catch (error) {
      console.log(error);
    }
  };
  static sendEmail = async (name, email, token) => {
    // console.log(name,email,status,comment)
    // connenct with the smtp server

    let transporter = await nodeMailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,

      auth: {
        user: "adityachaturveditaekwondo@gmail.com",
        pass: "vxtcmicuuamvowwp",
      },
    });
    let info = await transporter.sendMail({
      from: "test@gmail.com", // sender address
      to: email, // list of receivers
      subject: "Reset Password", // Subject line
      text: "heelo", // plain text body
      html:
        "<p>Hii " +
        name +
        ',Please click here to <a href="http://localhost:3000/reset-password?token=' +
        token +
        '">Reset</a>Your Password.',
    });
  };
  static resetPassword = async (req, res) => {
    try {
      const token = req.query.token;
      const tokenData = await UserModel.findOne({ token: token });
      if (tokenData) {
        res.render("reset-password", { user_id: tokenData._id });
      } else {
        res.render("404");
      }
    } catch (error) {
      console.log(error);
    }
  };
  static reset_Password1 = async (req, res) => {
    try {
      const { password, user_id } = req.body;
      const newHashPassword = await bcrypt.hash(password, 10);
      await UserModel.findByIdAndUpdate(user_id, {
        password: newHashPassword,
        token: "",
      });
      req.flash("success", "Reset Password Updated successfully ");
      res.redirect("/");
    } catch (error) {
      console.log(error);
    }
  };
}

module.exports = FrontController;
