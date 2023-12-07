require('dotenv').config()
const express = require('express');
const cors = require("cors")
const fs = require('fs');
var bodyParser = require('body-parser')

const app = express();
app.use(bodyParser.urlencoded());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
const port = process.env.PORT || 3000;

app.use(cors({
    origin: "*",
    methods: ['GET', 'POST', 'PUT', 'DELETE']
}))
app.use(express.json());       // to support JSON-encoded bodies
app.use(express.urlencoded()); // to support URL-encoded bodies

app.get('/books', (req, res) => {
    try {
        const books = JSON.parse(fs.readFileSync('./bd.json'));
        res.json(books);
    } catch (error) {
        res.status(500).json(error.message);
    }
});
app.get('/books/search/:text', (req, res) => {
    try{
        const data = req.params.text.toLowerCase();
        const books = JSON.parse(fs.readFileSync('./bd.json'));
        const book = books.filter((book) => book.title.toLowerCase().includes(data) || book.author.toLowerCase().includes(data));
    
        res.json(book);
    }catch (error) {
        res.status(500).json(error.message);
    }
});
app.get('/book/:id', (req, res) => {
    try{
        const id = parseInt(req.params.id);
        const books = JSON.parse(fs.readFileSync('./bd.json'));
        const book = books.filter((book) => book.id === id);
        if (book.length === 0) {
            res.json({status: 404, message: 'Libro no encontrado'});
        }else{
            res.json({status: 200, book: book[0]});
        }
    }catch (error) {
        res.status(500).json(error.message);
    }
});

app.post('/book', (req, res) => {
    try{
        const books = JSON.parse(fs.readFileSync('./bd.json'));
        const lastBook = books.length > 0 ? books[books.length - 1]['id'] : 0;
        let date = new Date(req.body.publicationYear).getFullYear();
        const newBook = {
            id: lastBook + 1,
            title: req.body.title,
            author: req.body.author,
            yearPublication: date,
            isbn: req.body.isbn,
            available: true
        };
        books.push(newBook);
        fs.writeFileSync('./bd.json', JSON.stringify(books));
        res.send(true);
    }catch (error) {
        res.status(500).json(error.message);
    }
});
app.put('/book/:id', (req, res) => {
    try{
        const id = parseInt(req.params.id);
        const books = JSON.parse(fs.readFileSync('./bd.json'));
        const cont = Object.keys(req.body).length;
        if (cont === 1) {
            books.forEach((book) => {
                if (book.id === id) {
                    book.available = req.body.available;
                }
            });
        } else {
            let date = new Date(req.body.publicationYear).getFullYear();
            books.forEach((book) => {
                if (book.id === id) {
                    book.title = req.body.title;
                    book.author = req.body.author;
                    book.yearPublication = date;
                    book.isbn = req.body.isbn;
                    book.available = req.body.available;
                }
            });
        }
        fs.writeFileSync('./bd.json', JSON.stringify(books));
        res.send(true);
    }catch (error) {
        res.status(500).json(error.message);
    }
});



app.delete('/book/:id', (req, res) => {
    try{
        const id = parseInt(req.params.id);
        const books = JSON.parse(fs.readFileSync('./bd.json'));
        const newBooks = books.filter((book) => book.id !== id);
    
        fs.writeFileSync('./bd.json', JSON.stringify(newBooks));
        res.json(newBooks);
    }catch (error) {
        res.status(500).json(error.message);
    }
});


app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});


