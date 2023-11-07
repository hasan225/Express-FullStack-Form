const registerModel = require("../models/register_model");
const bcrypt = require("bcrypt");

const userRegisterPage = (req, res) => {
  res.render("register");
};
const userRegisteration = async (req, res) => {
  try {
    if (req.body.password === req.body.confirmpassword) {
      const registerUser = new registerModel({
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        email: req.body.email,
        gender: req.body.gender,
        phone: req.body.phone,
        age: req.body.age,
        password: req.body.password,
        confirmpassword: req.body.confirmpassword,
      });

      const token = await registerUser.generateAuthToken();
      // res.cookie("jwt",token)
      // console.log(cookie)

      const saveDB = await registerUser.save();
      res.status(200).render("index", {
        user: `${req.body.firstname}  ${req.body.lastname} `,
      });
    } else {
      res.status(202).send("passwords dont match");
    }
  } catch (error) {
    console.log(error);
  }
};

const userLoginPage = (req, res) => {
  res.render("login");
};

const userLogin = async (req, res) => {
  try {
    const email = req.body.email;
    const password = req.body.password;

    const userEmail = await registerModel.findOne({ email: email });
    const isMatch = await bcrypt.compare(password, userEmail.password);

    const token = await userEmail.generateAuthToken();

    
    if (isMatch) {
      res.status(201).render("index", {
        user: `${userEmail.firstname}  ${userEmail.lastname} `,
      });
    } else {
      res.status(404).send("password dont match");
    }
  } catch (error) {
    res.send(error);
    console.log(error,"error came");
  }
};

module.exports = {
  userRegisterPage,
  userRegisteration,
  userLoginPage,
  userLogin,
};
