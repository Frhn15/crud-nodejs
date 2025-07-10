const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const Book = require('./models/Book');
const multer = require('multer');
const path = require('path');

const app = express();

// Upload setup
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'public/uploads');
    },
    filename: function(req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage });

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/crudnodejs');

// Middleware
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));

// Home - list books
app.get('/', async (req, res) => {
    const books = await Book.find();
    res.render('index', { books });
});

// Add book form
app.get('/add', (req, res) => {
    res.render('add');
});

// Process add book
app.post('/add', upload.single('cover'), async (req, res) => {
    const { title, author, year } = req.body;
    let cover = req.file ? req.file.filename : '';
    await Book.create({ title, author, year, cover });
    res.redirect('/');
});

// Edit book form
app.get('/edit/:id', async (req, res) => {
    const book = await Book.findById(req.params.id);
    res.render('edit', { book });
});

// Process edit book
app.post('/edit/:id', upload.single('cover'), async (req, res) => {
    const { title, author, year } = req.body;
    let updateData = { title, author, year };
    if (req.file) {
        updateData.cover = req.file.filename;
    }
    await Book.findByIdAndUpdate(req.params.id, updateData);
    res.redirect('/');
});

// Delete book
app.get('/delete/:id', async (req, res) => {
    await Book.findByIdAndDelete(req.params.id);
    res.redirect('/');
});

// Borrow book (Pinjam)
app.post('/borrow/:id', async (req, res) => {
    const { name, nim } = req.body;
    await Book.findByIdAndUpdate(req.params.id, {
        status: 'Dipinjam',
        borrower: { name, nim }
    });
    res.redirect('/');
});

// Return book (Kembalikan)
app.post('/return/:id', async (req, res) => {
    await Book.findByIdAndUpdate(req.params.id, {
        status: 'Tersedia',
        borrower: { name: '', nim: '' }
    });
    res.redirect('/');
});

// Run server
app.listen(3000, () => {
    console.log('Server running at http://localhost:3000');
});
