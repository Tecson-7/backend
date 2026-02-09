const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// MySQL connection
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Myfavtbmm@123",
  database: "login"
});

db.connect(err => {
  if (err) throw err;
  console.log("MySQL Connected");
});

// TEST GET API
app.get("/users", (req, res) => {
  db.query("SELECT * FROM users", (err, result) => {
    if (err) return res.status(500).send(err);
    res.send(result);
  });
});

// LOGIN API
app.post("/login", (req, res) => {
  const { email, password } = req.body;

  const sql = "SELECT * FROM users WHERE email=? AND password=?";
  db.query(sql, [email, password], (err, result) => {
    if (err) return res.status(500).send(err);

    if (result.length > 0) {
      res.send({ message: "Login Successful" });
    } else {
      res.status(401).send({ message: "Invalid Credentials" });
    }
  });
});

// REGISTER API
app.post("/register", (req, res) => {
  const { email, password } = req.body;

  // check if user already exists
  const checkQuery = "SELECT * FROM users WHERE email = ?";
  db.query(checkQuery, [email], (err, result) => {
    if (err) {
      console.log(err);
      return res.status(500).send({ message: "Database error" });
    }

    if (result.length > 0) {
      return res.status(409).send({ message: "User already exists" });
    }

    // insert new user
    const insertQuery =
      "INSERT INTO users (email, password) VALUES (?, ?)";
    db.query(insertQuery, [email, password], (err) => {
      if (err) {
        console.log(err);
        return res.status(500).send({ message: "Insert failed" });
      }

      res.send({ message: "User Registered Successfully" });
    });
  });
});


app.listen(5000, () => {
  console.log("Server running on port 5000");
});
