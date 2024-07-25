const jwt = require('jsonwebtoken')
const UserModel = require('../models/user')
const checkUseAuth = async(req, res, next) => {
          // console.log("hello Auth")
          const { Token } = req.cookies
          // console.log(Token)

          if (!Token) {
          req.flash('error', 'Unauthorised user please login')
          res.redirect("/")
          }else {
          const verifyLogin = jwt.verify(Token, 'Aditya@1234')
          // console.log(verifyLogin)
          const data = await UserModel.findOne({_id:verifyLogin.ID})
          // console.log(data)
          req.data =data
          next()
}

}

module.exports = checkUseAuth