const jwt = require("jsonwebtoken");
require("dotenv").config();

module.exports = async (req, res, next) => {
  try {
    //get token from header client side
    const jwttoken = req.header("token");
    //check if token exists
    if (!jwttoken) {
      return res.status(403).send("Not authorized");
    }

    //check if token is a correct token
    const payload = jwt.verify(jwttoken, process.env.jwtsecret);

    req.user = payload.user;
    next();
  } catch (err) {
    console.error(err.message);
    return res.status(403).send("Not Authorized NO");
  }
};
