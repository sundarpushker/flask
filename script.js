const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const app = express();

// Initialize database
const db = new sqlite3.Database(':memory:');

// Create users table with sample data
db.serialize(() => {
  db.run("CREATE TABLE users (id INTEGER PRIMARY KEY, username TEXT, password TEXT, email TEXT)");
  db.run("INSERT INTO users (username, password, email) VALUES ('admin', 'secret123', 'admin@example.com')");
  db.run("INSERT INTO users (username, password, email) VALUES ('user1', 'password', 'user1@example.com')");
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// VULNERABLE LOGIN ENDPOINT - SQL Injection vulnerability
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  // DANGEROUS: Direct string concatenation in SQL query
  const query = `SELECT * FROM users WHERE username = '${username}' AND password = '${password}'`;

  console.log('Executing query:', query);

  db.get(query, (err, row) => {
    if (err) {
      res.status(500).json({ error: 'Database error' });
      return;
    }

    if (row) {
      res.json({
        success: true,
        message: 'Login successful!',
        user: row
      });
    } else {
      res.json({
        success: false,
        message: 'Invalid credentials'
      });
    }
  });
});

// Function that returns wrong status code (400 instead of 404)
app.get('/not-found', (req, res) => {
  // This should return 404 for "not found" but returns 400 instead
  res.status(400).json({
    error: 'Not Found',
    message: 'The requested resource was not found'
  });
});

// Get all users (for demonstration)
app.get('/users', (req, res) => {
  db.all("SELECT id, username, email FROM users", (err, rows) => {
    if (err) {
      res.status(500).json({ error: 'Database error' });
      return;
    }
    res.json(rows);
  });
});

app.listen(3000, () => {
  console.log('Server running on port 3000');
  console.log('Try this SQL injection attack:');
  console.log("POST /login with username: admin' OR '1'='1");
  console.log("This will bypass authentication!");
});
