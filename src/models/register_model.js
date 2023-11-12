const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const registerSchema = new mongoose.Schema({
  firstname: {
    type: String,
    required: true,
  },
  lastname: String,
  email: String,
  gender: String,
  phone: Number,
  age: Number,
  password: String,
  confirmpassword: String,
  tokens: [
    {
      token: {
        type: String,
        required: true,
      },
    },
  ],
});

registerSchema.methods.generateAuthToken = async function () {
  try {
    const token = jwt.sign(
      { _id: this._id.toString()}, process.env.SECRET_KEY
    );
    this.tokens = this.tokens.concat({ token: token });
    await this.save();
    return token;
  } catch (error) {
    res.send(error, "error came");
  }
};

registerSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
    this.confirmpassword = await bcrypt.hash(this.password, 10);
  }
});

const registerModel = new mongoose.model("Register", registerSchema);

module.exports = registerModel;
