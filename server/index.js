const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");

const config = require("./config/key");

const { User } = require("./models/user");
const { auth } = require("./middleware/auth");

const app = express();
const port = process.env.PORT || 5500;
app.listen(port, () => console.log(`Now server listening ${port}`));
mongoose
  .connect(config.mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log(`Now mongoose connected`))
  .catch((error) => console.log(error));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.get("/", (req, res) => {
  res.json({ zizimoos: "Hello World" });
});

app.get("/api/user/auth", auth, (req, res) => {
  res.status(200).json({
    id: req._id,
    isAuth: true,
    email: req.user.email,
    name: req.user.name,
    lastname: req.user.lastName,
    role: req.user.role,
  });
});

app.post("/api/users/register", (req, res) => {
  const user = new User(req.body);

  user.save((error, data) => {
    if (error) {
      return res.json({ success: false, error });
    }
    res.status(200).json({ success: true, userData: data });
  });
});

app.post("/api/user/login", (req, res) => {
  //find email & user

  User.findOne({ email: req.body.email }, (error, user) => {
    if (!user) {
      return res.json({
        loginSuccess: false,
        message: "Auth failed, email not found",
      });
    }
    //compare password
    user.comparePassword(req.body.password, (error, isMatch) => {
      if (!isMatch) {
        return res.json({ loginSuccess: false, message: "wrong password" });
      }
    });
    //generate token
    user.generateToken((error, user) => {
      if (error) return res.status(400).send(error);

      res.cookie("x_auth", user.token).status(200).json({
        loginSuccess: true,
      });
    });
  });
});

app.get("/api/user/logout", auth, (req, res) => {
  User.findOneAndUpdate({ _id: req.user._id }, { token: "" }, (err, doc) => {
    if (err) return res.json({ success: false, err });
    return res.status(200).send({
      success: true,
    });
  });
});
