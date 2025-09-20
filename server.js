const express = require("express");
const mysql = require("mysql2"); // use mysql2 for better compatibility
const cors = require("cors");
const path = require("path");
require("dotenv").config(); // read .env file

const app = express();
const port = process.env.APP_PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Update the frontend path
const frontendPath = path.join(__dirname, "../Project-300-main2/Project-300-main2/Project-300-main/Project-300-main/cc website");
app.use(express.static(frontendPath));

app.get("/", (req, res) => {
  res.sendFile(path.join(frontendPath, "index.html"));
});

// MySQL connection (AlwaysData)
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
});

db.connect((err) => {
  if (err) {
    console.error("Database connection failed:", err);
  } else {
    console.log("Connected to AlwaysData MySQL database!");
  }
});

// Registration
app.post("/register", (req, res) => {
  const { name, email, password } = req.body;
  db.query("SELECT * FROM users WHERE email = ?", [email], (err, results) => {
    if (err) {
      console.error("Database error during registration check:", err);
      return res.status(500).json({ message: "Internal server error." });
    }
    if (results.length > 0) {
      return res.status(409).json({ message: "User with this email already exists." });
    }

    const sql = "INSERT INTO users (name, email, password) VALUES (?, ?, ?)";
    db.query(sql, [name, email, password], (err) => {
      if (err) {
        console.error("Registration error:", err);
        return res.status(500).json({ message: "Registration failed" });
      }
      res.status(200).json({ message: "Registration successful" });
    });
  });
});

// Login
app.post("/login", (req, res) => {
  const { email, password } = req.body;
  const sql = "SELECT * FROM users WHERE email = ? AND password = ?"; 
  db.query(sql, [email, password], (err, results) => {
    if (err) {
      console.error("Login error:", err);
      return res.status(500).json({ error: "Login failed" });
    }
    if (results.length > 0) {
      res.status(200).json({ message: "Login successful", name: results[0].name });
    } else {
      res.status(401).json({ error: "Invalid email or password" });
    }
  });
});

// Booking / Contact Form
app.post("/contact", (req, res) => {
  const { name, email, phone, checkin, checkout, guests, room, requests } = req.body;

  const sql = `
    INSERT INTO contacts (name, email, phone, checkin, checkout, guests, room, requests)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(sql, [name, email, phone, checkin, checkout, guests, room, requests], (err) => {
    if (err) {
      console.error("Booking error:", err);
      return res.status(500).json({ message: "Booking failed" });
    }
    res.status(200).json({ message: "Booking successful" });
  });
});

// Fetch all bookings for a user
app.get("/user-bookings", (req, res) => {
  const email = req.query.email;
  if (!email) return res.status(400).json({ message: "Email query parameter is required" });

  const sql = `
    SELECT name, email, room, checkin, checkout, guests, requests, created_at
    FROM contacts
    WHERE email = ?
    ORDER BY created_at DESC
  `;

  db.query(sql, [email], (err, results) => {
    if (err) {
      console.error("Fetch user bookings error:", err);
      return res.status(500).json({ message: "Failed to fetch booking info" });
    }
    if (results.length === 0) return res.status(404).json({ message: "No bookings found" });
    res.status(200).json(results);
  });
});

// Checkout (delete bookings)
app.delete("/checkout", (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: "Email is required for checkout." });

  const sql = "DELETE FROM contacts WHERE email = ?";
  db.query(sql, [email], (err, result) => {
    if (err) {
      console.error("Checkout error:", err);
      return res.status(500).json({ message: "Checkout failed." });
    }
    if (result.affectedRows === 0) return res.status(404).json({ message: "No active bookings found" });
    res.status(200).json({ message: "Checkout successful" });
  });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

