const CourseModel = require("../models/course");
const UserModel = require("../models/user");
const bcrypt = require("bcrypt");
// const cloudinary = require("cloudinary");
const nodeMailer = require("nodemailer");

class AdminController {
  static dashboard = async (req, res) => {
    try {
      const { name, email, image } = req.data;
      res.render("admin/dashboard", { uname: name, image: image });
    } catch (error) {
      console.log(error);
    }
  };
  static display = async (req, res) => {
    try {
      const { name, email, image } = req.data;
      const data = await CourseModel.find();
      // console.log(data)
      res.render("admin/Display", { d: data, uname: name, image: image });
    } catch (error) {
      console.log(error);
    }
  };
  static adminView = async (req, res) => {
    try {
      const { name, email, image } = req.data;
      const data = await CourseModel.findById(req.params.id);
      res.render("admin/View", { d: data, uname: name, image: image });
    } catch (error) {
      console.log(error);
    }
  };
  static adminEdit = async (req, res) => {
    try {
      const { name, email, image } = req.data;
      const data = await CourseModel.findById(req.params.id);
      res.render("admin/Edit", { d: data, uname: name, image: image });
    } catch (error) {
      console.log(error);
    }
  };
  static adminDel = async (req, res) => {
    try {
      const data = await CourseModel.findByIdAndDelete(req.params.id);
      res.redirect("/admin/courseDisplay");
    } catch (error) {
      console.log(error);
    }
  };
  static updatestatus = async (req, res) => {
    try {
      // console.log(req.body)
      const { comment, name, email, status } = req.body;
      await CourseModel.findByIdAndUpdate(req.params.id, {
        comment: comment,
        status: status,
      });
      this.sendEmail(name, email, status, comment);
      res.redirect("/admin/courseDisplay");
    } catch {
      console.log(error);
    }
  };
  static sendEmail = async (name, email, status, comment) => {
    // console.log(name,email,status,comment)
    // connenct with the smtp server

    let transporter = await nodeMailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,

      auth: {
        user: "adityachaturveditaekwondo@gmail.com",
        pass: "vxtcmicuuamvowwp", //2 step verification password
      },
    });
    let info = await transporter.sendMail({
      from: "test@gmail.com", // sender address
      to: email, // list of receivers
      subject: ` Course ${status}`, // Subject line
      text: "hello", // plain text body
      html: `<b>${name}</b> Course  <b>${status}</b> successful! <br>
         <b>Comment from Admin</b> ${comment} `, // html body
    });
  };
  static chngpass = async (req, res) => {
    try {
      const { name, email, image, password } = req.data;
      res.render("admin/chngpass", {
        uname: name,
        image: image,
        email: email,
        passowrd: password,
      });
    } catch (error) {
      console.log(error);
    }
  };
  static upadmPassword = async (req, res) => {
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
          res.redirect("/admin/chngpass");
        } else {
          if (np != cp) {
            req.flash("error", "Password does not match");
            res.redirect("admin/chngpass");
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
        res.redirect("/admin/chngpass");
      }
    } catch (error) {
      console.log(error);
    }
  };
  static admProfile = async (req, res) => {
    try {
      try {
        const { name, email, image, contact } = req.data;
        res.render("admin/admProfile", {
          uname: name,
          image: image,
          email: email,
          mobile_no: contact,
        });
      } catch (error) {
        console.log(error);
      }
    } catch (error) {
      console.log(error);
    }
  };
  static upadmProfile = async (req, res) => {
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
      res.redirect("/admProfile");
    } catch (error) {
      console.log(error);
    }
  };
}
module.exports = AdminController;
