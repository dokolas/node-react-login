//https://youtu.be/7UQBMb8ZpuE

const express = require("express");
const app = express();
const cors = require("cors");

//middlewares
app.use(express.json()); //req.body
app.use(cors());

//routes
//register and login route
app.use("/auth", require("./routes/jwtauth"));

//dashboard route
app.use("/dashboard", require("./routes/dashboard"));

app.listen(5000, () => {
  console.log(`Listening on port 5000`);
});
