const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const app = express();
const PORT = 3003;

// Inisialisasi database SQLite
const db = new sqlite3.Database('./comment.db');

// Membuat tabel comments jika belum ada
db.serialize(() => {
    db.run("CREATE TABLE IF NOT EXISTS comments (id INTEGER PRIMARY KEY AUTOINCREMENT, post_id INTEGER, content TEXT, created_at DATETIME DEFAULT CURRENT_TIMESTAMP, FOREIGN KEY(post_id) REFERENCES posts(id))");
});

app.use(bodyParser.json());

// Menambahkan komentar pada postingan
app.post('/comments', (req, res) => {
    const { post_id, content } = req.body;
    db.run("INSERT INTO comments (post_id, content) VALUES (?, ?)", [post_id, content], function(err) {
        if (err) {
            return res.status(500).send("Error adding comment");
        }
        res.status(201).send({ id: this.lastID, post_id, content });
    });
});

// Menjalankan server
app.listen(PORT, () => {
    console.log(`Comment Service is running at http://localhost:${PORT}`);
}); 