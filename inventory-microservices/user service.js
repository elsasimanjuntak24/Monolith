const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const app = express();
const PORT = 3001;

// Inisialisasi database SQLite
const db = new sqlite3.Database('./user.db');

// Membuat tabel users jika belum ada
db.serialize(() => {
    db.run("CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, email TEXT, password TEXT)");
});

app.use(bodyParser.json());

// Pendaftaran Pengguna
app.post('/register', (req, res) => {
    const { name, email, password } = req.body;
    db.run("INSERT INTO users (name, email, password) VALUES (?, ?, ?)", [name, email, password], function(err) {
        if (err) {
            return res.status(500).send("Error in registration");
        }
        res.status(201).send({ id: this.lastID, name, email });
    });
});

// Login Pengguna
app.post('/login', (req, res) => {
    const { email, password } = req.body;
    db.get("SELECT * FROM users WHERE email = ? AND password = ?", [email, password], (err, row) => {
        if (err || !row) {
            return res.status(401).send("Invalid credentials");
        }
        res.send({ message: "Login successful", user: row });
    });
});

// Menjalankan server
app.listen(PORT, () => {
    console.log(`User Service is running at http://localhost:${PORT}`);
});