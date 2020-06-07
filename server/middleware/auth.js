const { User } = require("../models/user");

let auth = (req, res, next) => {
  let token = req.cookies.x_auth;

  User.findByToken(token, (error, user) => {
    if (error) throw error;
    if (!user)
      return res.json({
        isAuth: false,
        error: true,
      });
    req.token = token;
    req.user = user;
    req.user.id = user.id;
    next();
  });
};

module.exports = { auth };
