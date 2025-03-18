const express = require('express');
const axios = require('axios');
const app = express();
const PORT = 3000;

app.use(express.json());

// Routing untuk user service
app.use('/users', (req, res) => {
    axios({
        method: req.method,
        url: `http://localhost:3001${req.url}`,
        data: req.body
    }).then(response => {
        res.json(response.data);
    }).catch(err => {
        res.status(500).send(err.message);
    });
});

// Routing untuk post service
app.use('/posts', (req, res) => {
    axios({
        method: req.method,
        url: `http://localhost:3002${req.url}`,
        data: req.body
    }).then(response => {
        res.json(response.data);
    }).catch(err => {
        res.status(500).send(err.message);
    });
});

// Routing untuk comment service
app.use('/comments', (req, res) => {
    axios({
        method: req.method,
        url: `http://localhost:3003${req.url}`,
        data: req.body
    }).then(response => {
        res.json(response.data);
    }).catch(err => {
        res.status(500).send(err.message);
    });
});

// Menjalankan server
app.listen(PORT, () => {
    console.log(`API Gateway running at http://localhost:${PORT}`);
});
