const jwt = require("jsonwebtoken");
require("dotenv").config();

const jwtGenerator = (user_id) => {
  const payload = {
    user: user_id,
  };

  return jwt.sign(payload, process.env.jwtsecret, { expiresIn: 60 * 30 });
};

module.exports = jwtGenerator;
