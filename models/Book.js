const mongoose = require('mongoose');

const BookSchema = new mongoose.Schema({
    title: String,
    author: String,
    year: Number,
    cover: String,
    status: {
        type: String,
        default: 'Tersedia'
    },
    borrower: {
        name: String,
        nim: String
    }
});

module.exports = mongoose.model('Book', BookSchema);
