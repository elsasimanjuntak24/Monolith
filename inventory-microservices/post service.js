const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const app = express();
const PORT = 3002;

// Inisialisasi database SQLite
const db = new sqlite3.Database('./post.db');

// Membuat tabel posts jika belum ada
db.serialize(() => {
    db.run("CREATE TABLE IF NOT EXISTS posts (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT, content TEXT, created_at DATETIME DEFAULT CURRENT_TIMESTAMP)");
});

app.use(bodyParser.json());

// Menampilkan semua postingan
app.get('/posts', (req, res) => {
    db.all("SELECT * FROM posts", [], (err, rows) => {
        if (err) {
            return res.status(500).send("Error retrieving posts");
        }
        res.json(rows);
    });
});

// Membuat postingan baru
app.post('/posts', (req, res) => {
    const { title, content } = req.body;
    db.run("INSERT INTO posts (title, content) VALUES (?, ?)", [title, content], function(err) {
        if (err) {
            return res.status(500).send("Error creating post");
        }
        res.status(201).send({ id: this.lastID, title, content });
    });
});

// Menjalankan server
app.listen(PORT, () => {
    console.log(`Post Service is running at http://localhost:${PORT}`);
});
