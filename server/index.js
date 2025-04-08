require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const UsersModel = require("./models/User");
const nodemailer = require("nodemailer");

const app = express();
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

mongoose.connect("mongodb://localhost:27017/Users", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Register Route
app.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await UsersModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await UsersModel.create({
      name,
      email,
      password: hashedPassword,
    });

    res.json({ message: "User registered successfully", user: newUser });
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Login Route
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await UsersModel.findOne({ email });

    if (!user) {
      return res.status(404).json({ error: "No account found with this email" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Incorrect password" });
    }

    res.json({ message: "Login successful" });
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Forgot Password
app.post("/forgot-password", (req, res) => {
  const { email } = req.body;
  UsersModel.findOne({ email }).then((user) => {
    if (!user) {
      return res.send({ Status: "No account found with this email" });
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email, // <-- FIXED THIS LINE
      subject: "Reset your password",
      text: `http://localhost:5173/reset-password/${user._id}/${token}`,
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
        return res.send({ Status: "Failed to send email" });
      } else {
        return res.send({ Status: "Success" });
      }
    });
  });
});

// Reset Password
app.post("/reset-password/:id/:token", (req, res) => {
  const { id, token } = req.params;
  const { password } = req.body;

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.json({ Status: "Error with token" });
    } else {
      bcrypt
        .hash(password, 10)
        .then((hash) => {
          UsersModel.findByIdAndUpdate({ _id: id }, { password: hash })
            .then(() => res.send({ Status: "Success" }))
            .catch((err) => res.send({ Status: err }));
        })
        .catch((err) => res.send({ Status: err }));
    }
  });
});

app.listen(3001, () => {
  console.log("✅ Server is running on http://localhost:3001");
});
