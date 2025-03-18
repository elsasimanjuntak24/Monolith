const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const app = express();
const PORT = 3000;

// Inisialisasi database SQLite
const db = new sqlite3.Database('./blog.db');

// Membuat tabel posts jika belum ada
db.serialize(() => {
    db.run("CREATE TABLE IF NOT EXISTS posts (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT, content TEXT, created_at DATETIME DEFAULT CURRENT_TIMESTAMP)");
});

// Middleware untuk parsing JSON
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

// Menampilkan postingan berdasarkan ID
app.get('/posts/:id', (req, res) => {
    const { id } = req.params;
    db.get("SELECT * FROM posts WHERE id = ?", [id], (err, row) => {
        if (err || !row) {
            return res.status(404).send("Post not found");
        }
        res.json(row);
    });
});

// Membuat postingan baru
app.post('/posts', (req, res) => {
    const { title, content } = req.body;
    if (!title || !content) {
        return res.status(400).send("Title and content are required");
    }
    db.run("INSERT INTO posts (title, content) VALUES (?, ?)", [title, content], function(err) {
        if (err) {
            return res.status(500).send("Error creating post");
        }
        res.status(201).send({ id: this.lastID, title, content });
    });
});

// Mengupdate postingan berdasarkan ID
app.put('/posts/:id', (req, res) => {
    const { id } = req.params;
    const { title, content } = req.body;
    if (!title || !content) {
        return res.status(400).send("Title and content are required");
    }
    db.run("UPDATE posts SET title = ?, content = ? WHERE id = ?", [title, content, id], function(err) {
        if (err || this.changes === 0) {
            return res.status(404).send("Post not found or failed to update");
        }
        res.send({ id, title, content });
    });
});

// Menghapus postingan berdasarkan ID
app.delete('/posts/:id', (req, res) => {
    const { id } = req.params;
    db.run("DELETE FROM posts WHERE id = ?", [id], function(err) {
        if (err || this.changes === 0) {
            return res.status(404).send("Post not found or failed to delete");
        }
        res.send({ message: `Post with ID ${id} deleted successfully` });
    });
});

// Menjalankan server pada port 3000
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
}); 