const express = require("express");
const nodemailer = require("nodemailer");
require("dotenv").config();

const app = express();
app.use(express.json());

// Health
app.get("/", (req, res) => res.send("OTP Backend Running 🚀"));

// Gmail (App Password जरूरी)
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

app.post("/api/auth/send-otp", (req, res) => {
  const { email } = req.body || {};

  if (!email) {
    return res.status(400).json({ msg: "Email required" });
  }

  const otp = Math.floor(100000 + Math.random() * 900000);

  // 🔥 IMPORTANT: तुरंत response (app unblock)
  res.status(200).json({ msg: "OTP accepted", otp });

  // 🔥 Email background में
  transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Your OTP",
    text: "Your OTP is: " + otp
  }, (err, info) => {
    if (err) console.log("Email error:", err);
    else console.log("Sent:", info.response);
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log("Server running on " + PORT));
