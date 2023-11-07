require("dotenv").config();
const express = require("express");
const app = express();
const path = require("path");
const hbs = require("hbs");
require("./db/connection");
const {
  userRegisterPage,
  userRegisteration,
  userLoginPage,
  userLogin,
} = require("./controllers/userController");

const port = process.env.PORT || 4000;
const host = process.env.HOST;
const staticPath = path.join(__dirname, "../public");
const pagesPath = path.join(__dirname, "../templates/views");
const partialsPath = path.join(__dirname, "../templates/partials");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(staticPath));
app.set("view engine", "hbs");
app.set("views", pagesPath);
hbs.registerPartials(partialsPath);

app.get("/", (req, res) => {
  res.render("index");
});
app.get("/register", userRegisterPage);
app.post("/register", userRegisteration);
app.get("/login", userLoginPage);
app.post("/login", userLogin);

app.listen(port, host, () => {
  console.log(`your server is live at http://${host}:${port}`);
});

// const jwt = require("jsonwebtoken");
// const { Certificate } = require("crypto");

// const createToken = async ()=>{
//   const token = await jwt.sign({_id:"65466ac6a325fc11b60fd89f"}, "keijfgwioerkergi4kefkrtjkdfkgj4ifjgo4t")

//   const userVarify = jwt.verify(token,"keijfgwioerkergi4kefkrtjkdfkgj4ifjgo4t")
//   console.log(userVarify)
// }

// createToken()
