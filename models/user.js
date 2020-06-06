const mogngoose = require("mongoose");

const userSchema = mogngoose.Schema({
  email: {
    type: String,
    minlength: 5,
  },
  name: { type: String, maxlength: 50 },
  lastName: { type: String, maxlength: 50 },
  password: { type: String, minlength: 5 },
  role: {
    type: Number,
    default: 0,
  },
  token: { type: String },
  tokenExp: { type: Number },
});

const User = mogngoose.model("User", userSchema);
module.exports = { User };
