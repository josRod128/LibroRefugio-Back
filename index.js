require('dotenv').config()
const express = require('express');
const cors = require("cors")
const fs = require('fs');

const app = express();
const port = process.env.PORT || 3000;

// app.use(express.static(path.join(__dirname,"public")));

app.use(cors({
    origin:"*",
    methods:['GET']
}))

app.get('/books', (req, res) => {
    res.json(JSON.parse(fs.readFileSync('./bd.json')));
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});


