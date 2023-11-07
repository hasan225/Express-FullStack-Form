const mongoose = require("mongoose");

mongoose
  .connect("mongodb://127.0.0.1/formDB", {
    //   useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("connected succesfully");
  })
  .catch("connection failed");

module.exports = mongoose;
