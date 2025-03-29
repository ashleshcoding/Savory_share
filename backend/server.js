const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();
const bcrypt = require("bcryptjs");
const User = require("./models/User");

const app = express();
const PORT = 3000;
app.use(express.json());

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("Connected successfully"))
  .catch((err) => console.log(err));

app.get("/", (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Welcome</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          background-color: #f8f9fa;
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100vh;
          text-align: center;
        }
        .container {
          background: white;
          padding: 20px;
          border-radius: 10px;
          box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
        }
        h1 {
          color: red;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>Welcome to the Backend of Savory Share</h1>
        <p>This is the backend home page.</p>
      </div>
    </body>
    </html>
  `);
});

app.post("/signup", async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const hashpassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, email, password: hashpassword });
    await newUser.save();
    res.json({ message: "User registered successfully" });
  } catch (err) {
    res.status(500).json({ error: "Error in registration" });
  }
});

app.post("/login", async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const user = await User.findOne({
      $or: [{ username }, { email }],
    });

    if (!user) {
      return res.status(400).json({ error: "Invalid username or email" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Incorrect password" });
    }

    res.json({ success: true, message: `Welcome ${user.username}!` });

  } catch (err) {
    res.status(500).json({ error: "Error in login" });
  }
});

app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
