// server.js
const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");
require("dotenv").config();

const app = express();

// Explicit CORS configuration
const corsOptions = {
  origin: '*',
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
};

app.use(cors(corsOptions));
app.use(express.json());

// Handle preflight requests explicitly
app.options("*", (req, res) => {
  res.set({
    "Access-Control-Allow-Origin": req.headers.origin,
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
  });
  res.sendStatus(200);
});

app.get("/", (req, res) => {
  res.set("Access-Control-Allow-Origin", req.headers.origin);
  res.send("Hello from Express on Vercel!");
});


// Email sending route
app.post("/send-email", async (req, res) => {
  const { name, email, phone, destination, guests, travelDates, message } =
    req.body;

  try {
    // Configure Nodemailer transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Email details
    const mailOptions = {
      from: email,
      to: process.env.RECIPIENT_EMAIL,
      subject: "New Trip Inquiry",
      text: `
        New Inquiry Received:

        Name: ${name}
        Email: ${email}
        Phone: ${phone}
        Destination: ${destination}
        Guests: ${guests}
        Travel Dates: ${travelDates}
        Message: ${message}
      `,
    };

    // Send email
    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: "Email sent successfully!" });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({ message: "Failed to send email." });
  }
});

// Export the handler for Vercel
module.exports = app;
