const router = require("express").Router();
const pool = require("../db");
const bcrypt = require("bcrypt");
const jwtGenerator = require("../utils/jwtgenerator");
const validInfo = require("../middleware/validInfo");
const authorization = require("../middleware/authorization");

//register route
router.post("/register", validInfo, async (req, res) => {
  try {
    //1 destructure req.body (name,email,pass)
    const { name, email, password } = req.body;

    //2 check if user exists, if user exists then throw error
    const user = await pool.query("SELECT * FROM USERS WHERE user_email = $1", [
      email,
    ]);

    if (user.rows.length !== 0) {
      return res.status(401).json("User already exists");
    }

    //3 bcrypt if user doen'st exist, dcrypt the password
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);

    const bcryptPassword = await bcrypt.hash(password, salt);
    //4 enter user in database

    const newUser = await pool.query(
      "INSERT INTO users (user_name, user_email, user_password) VALUES ($1, $2, $3) RETURNING *",
      [name, email, bcryptPassword]
    );

    //5 generating our jwt token

    const token = jwtGenerator(newUser.rows[0].user_id);

    res.json({ token });
  } catch (err) {
    console.log(err.message);
    res.status(500).json("Server Error");
  }
});

//login route
router.post("/login", validInfo, async (req, res) => {
  try {
    // 1. destructure req.body
    const { email, password } = req.body;
    // 2. check if user doens't exist, if not, throw error
    const user = await pool.query("SELECT * FROM users WHERE user_email = $1", [
      email,
    ]);

    if (user.rows.length === 0) {
      return res.status(401).json("Email or password is not correct");
    }
    // 3. if user exists, check if incoming password = db password

    const validPassword = await bcrypt.compare(
      password,
      user.rows[0].user_password
    );

    if (!validPassword) {
      return res.status(401).json("Email or password is not correct");
    }
    // 4. provide JWT token if above all checks out

    const token = jwtGenerator(user.rows[0].user_id);
    res.json({ token });
  } catch (err) {
    console.log(err.message);
    res.status(500).send("Server Error");
  }
});

router.get("/is-verify", authorization, async (req, res) => {
  try {
    res.json(true);
  } catch (err) {
    console.log(err.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
