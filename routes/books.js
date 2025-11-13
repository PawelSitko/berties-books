// routes/books.js

const express = require('express');
const router = express.Router();

/* 
  Route: /books/list
  Purpose: Show all books from the database
*/
router.get('/list', (req, res) => {
  const sqlquery = "SELECT * FROM books";

  db.query(sqlquery, (err, result) => {
    if (err) {
      console.error("Database error:", err);
      return res.send("Database error");
    }

    res.render("list.ejs", { availableBooks: result });
  });
});

/* 
  Route: /books/addbook
  Purpose: Display a form to add a new book
*/
router.get('/addbook', (req, res) => {
  res.render("addbook.ejs");
});

/* 
  Route: /books/bookadded
  Purpose: Insert a new book into the database
*/
router.post('/bookadded', (req, res, next) => {
  const sqlquery = "INSERT INTO books (name, price) VALUES (?, ?)";
  const newrecord = [req.body.name, req.body.price];

  db.query(sqlquery, newrecord, (err, result) => {
    if (err) {
      return next(err);
    }

    res.send(
      'This book has been added:<br><br>' +
      'Name: ' + req.body.name + '<br>' +
      'Price: ' + req.body.price
    );
  });
});

/* 
  Route: /books/bargainbooks
  Purpose: Show books with price < £20
*/
router.get('/bargainbooks', (req, res) => {
  const sqlquery = "SELECT * FROM books WHERE price < 20";

  db.query(sqlquery, (err, result) => {
    if (err) {
      console.error("Database error:", err);
      return res.send("Database error");
    }

    res.render("list.ejs", { availableBooks: result });
  });
});

/* 
  Route: /books/search
  Purpose: Show the book search form
*/
router.get('/search', (req, res) => {
  res.render("booksearch.ejs");
});

/* 
  Route: /books/searchresult
  Purpose: Show search results (partial match using LIKE)
*/
router.get('/searchresult', (req, res) => {
  const searchTerm = '%' + req.query.keyword + '%';
  const sqlquery = "SELECT * FROM books WHERE name LIKE ?";

  db.query(sqlquery, [searchTerm], (err, result) => {
    if (err) {
      console.error("Database error:", err);
      return res.send("Database error");
    }

    res.render("list.ejs", { availableBooks: result });
  });
});

/* 
  Export router so index.js can access it
*/
module.exports = router;
