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
  user.save((error, data) => {
    try {
      return res.status(200).json({ success: true });
    } catch (error) {
      return res.json({ success: false, error });
    }
  });
});
