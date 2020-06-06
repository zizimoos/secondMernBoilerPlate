const mogngoose = require("mongoose");
const bycrypt = require("bcrypt");
const saltRounds = 10;
const jwt = require("jsonwebtoken");

const userSchema = mogngoose.Schema({
  email: {
    type: String,
    minlength: 5,
  },
  name: {
    type: String,
    maxlength: 50,
  },
  lastName: {
    type: String,
    maxlength: 50,
  },
  password: {
    type: String,
    minlength: 5,
  },
  role: {
    type: Number,
    default: 0,
  },
  token: {
    type: String,
  },
  tokenExp: {
    type: Number,
  },
});

userSchema.pre("save", function (next) {
  let user = this;
  if (user.isModified("password")) {
    bcrypt.genSalt(saltRounds, (error, salt) => {
      if (error) return next(error);
      bycrypt.hash(user.password, salt, function (error, hash) {
        if (error) return next(error);
        user.password = hash;
        next();
      });
    });
  } else {
    next();
  }
});

userSchema.methods.comparePassword = (plainPassword, cb) => {
  bycrypt.compare(plainPassword, this.password, (error, isMatch) => {
    if (error) {
      return cb(error);
    }
    cb(null, isMatch);
  });
};
userSchema.methods.generateToken = (cb) => {
  let user = this;
  let token = jwt.sign(user._id.toHexString(), "secret");
  user.token = token;
  user.save((error, user) => {
    if (error) {
      return cb(error);
    }
    cb(null, user);
  });
};

const User = mogngoose.model("User", userSchema);
module.exports = { User };
