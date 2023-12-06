require('dotenv').config()
const express = require('express');
const cors = require("cors")
const fs = require('fs');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors({
    origin:"*",
    methods:['GET','POST','PUT','DELETE']
}))

app.get('/books', (req, res) => {
    res.json(JSON.parse(fs.readFileSync('./bd.json')));
});

app.delete('/book/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const books = JSON.parse(fs.readFileSync('./bd.json'));
    const newBooks = books.filter((book) => book.id !== id);
    
    fs.writeFileSync('./bd.json', JSON.stringify(newBooks));
    res.json(newBooks);
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});


