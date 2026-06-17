const express = require("express");
const router = express.Router();
const db = require("../db");

/* -------------------------
   VALIDATION FUNCTIONS
--------------------------*/
const validateEmail = (email) => /\S+@\S+\.\S+/.test(email);
const validatePhone = (phone) => /^[0-9]{10,15}$/.test(phone);

/* -------------------------
   1. POST - CREATE LEAD
--------------------------*/
router.post("/", (req, res) => {
  const { name, phone, email, platform, message } = req.body;

  if (!name || !phone || !email || !platform) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  if (!validateEmail(email)) {
    return res.status(400).json({ error: "Invalid email" });
  }

  if (!validatePhone(phone)) {
    return res.status(400).json({ error: "Invalid phone" });
  }

  const sql =
    "INSERT INTO leads (name, phone, email, platform, message) VALUES (?, ?, ?, ?, ?)";

  db.query(sql, [name, phone, email, platform, message], (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    res.status(201).json({
      message: "Lead created successfully",
      id: result.insertId,
    });
  });
});

/* -------------------------
   2. GET - ALL LEADS + FILTER
--------------------------*/
router.get("/", (req, res) => {
  const { platform } = req.query;

  let sql = "SELECT * FROM leads";
  let params = [];

  if (platform) {
    sql += " WHERE platform = ?";
    params.push(platform);
  }

  db.query(sql, params, (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    res.json(result);
  });
});

/* -------------------------
   3. PATCH - UPDATE STATUS
--------------------------*/
router.patch("/:id/status", (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const allowed = ["New", "Contacted", "Converted", "Rejected"];

  if (!allowed.includes(status)) {
    return res.status(400).json({ error: "Invalid status" });
  }

  const sql = "UPDATE leads SET status = ? WHERE id = ?";

  db.query(sql, [status, id], (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Lead not found" });
    }

    res.json({ message: "Status updated successfully" });
  });
});

/* -------------------------
   4. DELETE - REMOVE LEAD
--------------------------*/
router.delete("/:id", (req, res) => {
  const { id } = req.params;

  const sql = "DELETE FROM leads WHERE id = ?";

  db.query(sql, [id], (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Lead not found" });
    }

    res.json({ message: "Lead deleted successfully" });
  });
});

module.exports = router;