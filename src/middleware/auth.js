const jwt = require("jsonwebtoken");
const registerModel = require("../models/register_model");

const auth = async (req, res, next) => {
  try {
    const token = req.cookies.jwt
    const compare = jwt.verify(token, process.env.SECRET_KEY)
    const user = await registerModel.findOne({ _id:compare._id})
    console.log(user.firstname)

    req.token = token
    req.user = user
    
    next()
  } catch (error) {
    res.status(401).send(error);
  }
};


module.exports = auth