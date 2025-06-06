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

    // Generate token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" });

    // Send token along with user data
    res.json({
      message: "Login successful",
      user: {
        name: user.name,
        email: user.email,
        token: token,
      },
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
  const token = req.headers.authorization?.split(" ")[1];
  const { city } = req.body;

  console.log("📥 Incoming city:", city);

  if (!token) return res.status(401).json({ error: "Unauthorized" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await UsersModel.findById(decoded.id);

    if (!user) return res.status(404).json({ error: "User not found" });

    const formattedCity = city.trim().toLowerCase().replace(/\b\w/g, l => l.toUpperCase());

    console.log("✅ Found user:", user.email);
    console.log("🕵️ Existing searchHistory:", user.searchHistory);

    if (!user.searchHistory.includes(formattedCity)) {
      user.searchHistory.push(formattedCity);

      if (user.searchHistory.length > 10) user.searchHistory.shift();

      console.log("📌 Updated searchHistory:", user.searchHistory);

      await user.save();
      console.log("💾 User saved!");
    }

    res.json({ message: "Search saved", history: user.searchHistory });
  } catch (err) {
    console.error("❌ Error saving search:", err);
    res.status(500).json({ error: "Failed to save search history" });
  }
});




app.get("/search-history/:email", async (req, res) => {
  try {
    const user = await UsersModel.findOne({ email: req.params.email });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({ history: user.searchHistory });
  } catch (err) {
    console.error("❌ Error in GET /search-history:", err);
    res.status(500).json({ error: "Failed to fetch search history" });
  }
});

app.get('/ping', (req, res) => {
  res.status(200).send('pong');
});
