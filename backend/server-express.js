const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");

const app = express();
const port = process.env.PORT || 3000; // Use the provided port or default to 3000

app.use(cors());
app.use(express.json());

const dbConfig = {
  user: "binar",
  password: "binar",
  host: "localhost",
  port: 5432,
  database: "piggybank",
};

const pool = new Pool(dbConfig);

app.post("/api/financial", async (req, res) => {
  try {
    const {
      datetime,
      category,
      payment_type,
      amount,
      payment_provider,
      detail,
    } = req.body;

    const sql =
      "INSERT INTO financial.transaction (datetime, category, payment_type, amount, payment_provider, detail) VALUES ($1, $2, $3, $4, $5, $6)";

    const values = [
      datetime,
      category,
      payment_type,
      amount,
      payment_provider,
      detail,
    ];

    const result = await pool.query(sql, values);

    console.log("Data inserted successfully:", result);
    res.json({ success: true, message: "Data inserted successfully" });
  } catch (error) {
    console.error("Error inserting data:", error);
    res.status(500).json({ error: "Error inserting data" });
  }
});

app.get("/api/financial", async (req, res) => {
  try {
    const { month, year } = req.query;

    let sql = "SELECT * FROM financial.transaction order by datetime desc";

    if (month && year) {
      const date = `${year}-${String(month).padStart(2, "0")}`;
      sql =
        "SELECT * FROM financial.transaction WHERE TO_CHAR(datetime, 'YYYY-MM') = $1";
      const result = await pool.query(sql, [date]);
      console.log("Data retrieved successfully:", result.rows);
      res.json({ success: true, data: result.rows });
    } else {
      const result = await pool.query(sql);
      console.log("Data retrieved successfully:", result.rows);
      res.json({ success: true, data: result.rows });
    }
  } catch (error) {
    console.error("Error retrieving data:", error);
    res.status(500).json({ error: "Error retrieving data" });
  }
});

app.put("/api/financial", async (req, res) => {
  try {
    const id = req.query.id;

    if (!id) {
      return res.status(400).json({ error: "Missing id parameter" });
    }

    const {
      datetime,
      category,
      payment_type,
      amount,
      payment_provider,
      detail,
    } = req.body;

    const sql =
      "UPDATE financial.transaction SET datetime = $1, category = $2, payment_type = $3, amount = $4, payment_provider = $5, detail = $6 WHERE id = $7";

    const values = [
      datetime,
      category,
      payment_type,
      amount,
      payment_provider,
      detail,
      id,
    ];

    const result = await pool.query(sql, values);

    console.log("Data updated successfully:", result);
    res.json({ success: true, message: "Data updated successfully" });
  } catch (error) {
    console.error("Error updating data:", error);
    res.status(500).json({ error: "Error updating data" });
  }
});

app.delete("/api/financial", async (req, res) => {
  try {
    const id = req.query.id;

    if (!id) {
      return res.status(400).json({ error: "Missing id parameter" });
    }

    const sql = "DELETE FROM financial.transaction WHERE id = $1";
    const values = [id];

    const result = await pool.query(sql, values);

    console.log("Data deleted successfully:", result);
    res.json({ success: true, message: "Data deleted successfully" });
  } catch (error) {
    console.error("Error deleting data:", error);
    res.status(500).json({ error: "Error deleting data" });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
