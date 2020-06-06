const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const { User } = require("./models/user");
const config = require("./config/key");

const app = express();
app.listen(5500, () => console.log("Now server listening"));
mongoose
  .connect(config.mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log(`Now mongoose connected`))
  .catch((error) => console.log(error));

app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get("/", (req, res) => res.send(`Hello world`));
app.post("/api/users/register", (req, res) => {
  const user = new User(req.body);
  console.log(user);

  user.save((error, data) => {
    console.log("data", data);
    if (error) {
      return res.json({ success: false, error });
    }
    res.status(200).json({ success: true, userData: data });
  });
});
app.post("/api/user/login", (req, res) => {
  //find email & user
  console.log(User);
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
      if (error) {
        return res.status(400).send(error);
      }
      res.cookie("x_auth", user.token).status(200).json({
        loginSuccess: true,
      });
    });
  });
});
