const isLogin = async (req, res, next) => {
  //console.log('hello middleware')
  const { Token } = req.cookies;
  console.log(Token)
  if (Token) {
    res.redirect("/home");
  }
  next();
};
module.exports = isLogin