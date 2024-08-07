const user_model = require("../model/user_model");
const CryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken");

const findUser = async (req, res) => {
  try {
    console.log(req.body);
    const user = await user_model.findOne({ username: req.body.username });

    if (!user) {
      res.status(401).json({
        msg: "User not found, please check your credentials or SignUp",
      });
    } else if (user) {
      const decryptedPassword = CryptoJS.AES.decrypt(
        user.password,
        process.env.PASSWORD_SECRET_KEY
      ).toString(CryptoJS.enc.Utf8);
      if (decryptedPassword === req.body.password) {
        const token = jwt.sign(
          { number: user.number, username: user.username },
          process.env.SECRET_KEY,
          {
            expiresIn: "5h",
          }
        );
        res
          .status(200)
          .json({ msg: "Authentication Successful", token: token });
        console.log(token);
      } else {
        return res.status(401).json({ msg: "Incorrect password" });
      }
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: "Internal server error" });
  }
};

const verifyToken = async (req, res, next) => {
  const token = req.header("Authorization");
  if (!token) return res.status(401).json({ error: "No token provided" });

  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    const number = decoded.number;
    const username = decoded.username;
    //console.log(req.body.username, username);
    // if (username !== req.body.username)
    //   return res.status(401).json({ error: "Invalid token" });
    const user = await user_model.findOne({ number, username });
    if (!user) return res.status(401).json({ error: "Invalid token" });
    next();
  } catch (error) {
    res.status(401).json({ error: "Invalid token" });
  }
};

module.exports = { verifyToken, findUser };
