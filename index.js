const express = require("express");
const mongoose = require("mongoose");
const app = express();

app.listen(5500, () => console.log("Now server listening"));
mongoose
  .connect(
    "mongodb+srv://mtubeadmin:sadalwin12!@@cluster0-d3bqq.mongodb.net/<dbname>?retryWrites=true&w=majority",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => console.log(`Now mongoose connected`))
  .catch((error) => console.log(error));

app.get("/", (req, res) => res.send(`Hello world`));
