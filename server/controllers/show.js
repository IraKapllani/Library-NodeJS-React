const Book = require('../models/book');
const User = require("../models/user");
const mongoose = require('mongoose');


exports.getBooks = (req, res, next) => {
    Book.find()
        .then(books => {
            console.log(books);
            res.render('client/book-list', {
                books: books,
                pageTitle: 'All Books',
                path: '/books', 
            });
        })
        .catch(err => {
            console.log(err);
        });
};

exports.getBook = (req, res, next) => {
    const bookId = req.params.bookId;
    Book.findById(bookId)
        .then(book => {
            res.render('client/book-detail', {
                book: book,
                pageTitle: book.title,
                path: '/books', 
            });
        })
        .catch(err => console.log(err));

};



exports.getIndex = (req, res, next) => {
    Book.find()
        .then(books => {
            res.render('client/index', {
                books: books,
                pageTitle: 'Show List',
                path: '/',
            });
        })
        .catch(err => {
            console.log(err);
        });
}



exports.getReservations = (req, res, next) => {
    req.user
      .populate('reservations.items.bookId')
      .then(user => {
        const books = user.reservations.items;
        res.render('client/reservations', {
          path: '/reservations',
          pageTitle: 'Your Reservations',
          books: books,
        });
      })
      .catch(err => console.log(err));
  };


exports.postReservations = (req, res, next) => {
    const bookId = req.body.bookId;
    Book.findById(bookId)
    .then(book => {
        return req.user.addToReservations(book);
    }).then(result => {
        console.log(result);
        res.redirect('/reservations');
    })
    .catch(err =>{
        console.log(err);
    });

};


exports.postDeleteReservations = (req, res, next) => {
    const bookId = req.body.bookId;
    req.user
    .removeFromReservations(bookId)
      .then(result => {
        res.redirect('/reservations');
      })
      .catch(err => console.error(err));
};

