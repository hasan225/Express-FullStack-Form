const registerModel = require("../models/register_model");
const bcrypt = require("bcrypt");
const cookie = require("cookie");

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

      // Set a cookie
      const cookieValue = cookie.serialize("jwt", token, {
        maxAge: 360, // Cookie will expire after 1 hour
        httpOnly: true, // Cookie is accessible only through the HTTP protocol
        secure: true, // Cookie will only be sent over HTTPS
      });

      // Send the cookie in the response header
      res.setHeader("Set-Cookie", cookieValue);

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

    // Set a cookie
    const cookieValue = cookie.serialize("jwt", token, {
      maxAge: 360, // Cookie will expire after 1 hour
      httpOnly: true, // Cookie is accessible only through the HTTP protocol
      secure: true, // Cookie will only be sent over HTTPS
    });

    // Send the cookie in the response header
    res.setHeader("Set-Cookie", cookieValue);

    if (isMatch) {
      res.status(201).render("index", {
        user: `${userEmail.firstname}  ${userEmail.lastname} `,
      });
    } else {
      res.status(404).send("password dont match");
    }
  } catch (error) {
    res.send(error);
    console.log(error, "error came");
  }
};

const userCookiePage = (req, res) => {
  console.log("hello world");
  try {
    res.status(200).render("cookies", {
      cookie: `${req.cookies.jwt}`,
    });
  } catch (error) {
    res.status(401).send("please sign up first");
  }
};

const userLogoutPage = (req, res, next) => {
  console.log(req.user.firstname);
  try {
    req.user.token = [];
    console.log(req.user.token)

    res.clearCookie('jwt');

    // Delete a cookie
    const cookieOptions = {
      maxAge: 0,
    };

    const cookieValue = cookie.serialize("jwt", "", cookieOptions);
    res.setHeader("Set-Cookie", cookieValue);
    // next()
    res.render("login");
  } catch (error) {
    res.status(401).send(error, "this came");
  }
};

module.exports = {
  userRegisterPage,
  userRegisteration,
  userLoginPage,
  userLogin,
  userCookiePage,
  userLogoutPage,
};
