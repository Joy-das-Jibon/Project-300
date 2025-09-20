const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const app = express();
const port = process.env.APP_PORT || 3006;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ========== FRONTEND PATH ==========
const frontendPath = path.join(__dirname, "cc website");
app.use(express.static(frontendPath));

// Serve all HTML pages
app.get("/", (req, res) => {
  res.sendFile(path.join(frontendPath, "index.html"));
});

// For all other HTML pages (contact.html, services.html, etc.)
app.get("/:page", (req, res) => {
  const page = req.params.page;
  const filePath = path.join(frontendPath, page);
  res.sendFile(filePath, err => {
    if (err) {
      res.status(404).sendFile(path.join(frontendPath, "index.html"));
    }
  });
});

// ========== DATABASE CONNECTION ==========
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
});

db.connect(err => {
  if (err) console.error("Database connection failed:", err);
  else console.log("Connected to AlwaysData MySQL database!");
});

// ========== REGISTRATION ==========
app.post("/register", (req, res) => {
  const { name, email, password } = req.body;
  db.query("SELECT * FROM users WHERE email = ?", [email], (err, results) => {
    if (err) return res.status(500).json({ message: "Internal server error." });
    if (results.length > 0) return res.status(409).json({ message: "User already exists." });

    db.query("INSERT INTO users (name, email, password) VALUES (?, ?, ?)", [name, email, password], err => {
      if (err) return res.status(500).json({ message: "Registration failed" });
      res.status(200).json({ message: "Registration successful" });
    });
  });
});

// ========== LOGIN ==========
app.post("/login", (req, res) => {
  const { email, password } = req.body;
  db.query("SELECT * FROM users WHERE email = ? AND password = ?", [email, password], (err, results) => {
    if (err) return res.status(500).json({ error: "Login failed" });
    if (results.length > 0) res.status(200).json({ message: "Login successful", name: results[0].name });
    else res.status(401).json({ error: "Invalid email or password" });
  });
});

// ========== BOOKING / CONTACT FORM ==========
app.post("/contact", (req, res) => {
  const { name, email, phone, checkin, checkout, guests, room, requests } = req.body;
  db.query(
    `INSERT INTO contacts (name, email, phone, checkin, checkout, guests, room, requests)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [name, email, phone, checkin, checkout, guests, room, requests],
    err => {
      if (err) return res.status(500).json({ message: "Booking failed" });
      res.status(200).json({ message: "Booking successful" });
    }
  );
});

// ========== FETCH USER BOOKINGS ==========
app.get("/user-bookings", (req, res) => {
  const email = req.query.email;
  if (!email) return res.status(400).json({ message: "Email is required" });

  db.query(
    `SELECT name, email, room, checkin, checkout, guests, requests, created_at
     FROM contacts WHERE email = ? ORDER BY created_at DESC`,
    [email],
    (err, results) => {
      if (err) return res.status(500).json({ message: "Failed to fetch bookings" });
      if (results.length === 0) return res.status(404).json({ message: "No bookings found" });
      res.status(200).json(results);
    }
  );
});

// ========== CHECKOUT (DELETE BOOKINGS) ==========
app.delete("/checkout", (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: "Email is required" });

  db.query("DELETE FROM contacts WHERE email = ?", [email], (err, result) => {
    if (err) return res.status(500).json({ message: "Checkout failed" });
    if (result.affectedRows === 0) return res.status(404).json({ message: "No active bookings found" });
    res.status(200).json({ message: "Checkout successful" });
  });
});

// ========== START SERVER ==========
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
