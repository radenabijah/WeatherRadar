require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const UsersModel = require("./models/User");
const nodemailer = require("nodemailer");

const app = express();
app.use(express.json());

// Use CLIENT_URL from .env
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    methods: ['GET', 'POST'],
    credentials: true
  })
);

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

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

    res.json({
      message: "Login successful",
      user: { name: user.name, email: user.email }
    });
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Forgot Password
app.post("/forgot-password", (req, res) => {
  const { email } = req.body;
  UsersModel.findOne({ email }).then((user) => {
    if (!user) {
      return res.status(404).json({ Status: "No account found with this email" });
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
      to: email,
      subject: "Reset your password",
      text: `${process.env.CLIENT_URL}/reset-password/${user._id}/${token}`,
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

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`✅ Server is running on port ${PORT}`);
});


// Save search city to history
app.post("/search-history", async (req, res) => {
  const { email, city } = req.body;

  try {
    const user = await UsersModel.findOne({ email });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Avoid duplicate consecutive entries
    if (user.searchHistory[user.searchHistory.length - 1] !== city) {
      user.searchHistory.push(city);
      if (user.searchHistory.length > 10) {
        user.searchHistory.shift(); // keep only the latest 10
      }
      await user.save();
    }

    res.json({ message: "Search saved", history: user.searchHistory });
  } catch (err) {
    res.status(500).json({ error: "Failed to save search history" });
  }
});
