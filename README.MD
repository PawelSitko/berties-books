Bertie’s Books

This is my lab exercise for the Dynamic Web Applications module.
The project is a small web app called Bertie’s Books, which uses Node.js, Express and EJS, together with a MySQL database.

The aim of the lab was to learn how to connect a Node.js application to a database, render pages with EJS, and use routes to display different parts of the site. It also includes extra features like bargain books and a book search.

How the project works

The app uses Express for routing and EJS for the HTML templates.
MySQL stores the books, and the app reads from the database and displays the results in the browser.

There is a main page, an about page, and several book-related pages such as:
list all books
add a new book
show bargain books (books under £20)
search for a book by name
The styling is done through a single CSS file in the public folder.

File structure
berties-books/
  index.js
  package.json
  public/
    style.css
  routes/
    main.js
    books.js
    users.js
  views/
    index.ejs
    about.ejs
    list.ejs
    addbook.ejs
    booksearch.ejs
    partials/
      header.ejs
      footer.ejs


The main server code is in index.js.
Routes are kept separately in the routes folder.
All the page templates are in the views folder.

Installing and running the app

To install the required packages:
npm install


To run the app:

node index.js


After that, open:

http://localhost:8000

MySQL setup

I created the berties_books database, then added a books table:

CREATE TABLE books (
  id INT NOT NULL AUTO_INCREMENT,
  name VARCHAR(50),
  price DECIMAL(5,2) UNSIGNED,
  PRIMARY KEY (id)
);


I then inserted some sample book data.

I also created a MySQL user for the application:

CREATE USER 'berties_books_app'@'localhost' IDENTIFIED BY 'qwertyuiop';
GRANT ALL PRIVILEGES ON berties_books.* TO 'berties_books_app'@'localhost';


This user is used by the Node.js app to connect to the database.

Routes in the application
Main pages

/ – homepage

/about – about page

Book-related pages

/books/list – shows all books

/books/addbook – form to add a new book

/books/bookadded – adds a book to the database

/books/bargainbooks – shows books under £20

/books/search – displays the search form

/books/searchresult – shows search results

Running on the virtual server
On the server I installed Node.js and MySQL, copied my project across, and ran the app in the background using:
forever start index.js


To stop it:
forever stop index.js

Summary:
This lab exercise helped me practise:
setting up Express routes
using EJS templates
connecting Node.js to MySQL
querying data and displaying it on web pages
handling forms
working with a virtual server

The app now includes everything required from Labs 6abc, 6d and 6ef, including the extension tasks (bargain books and book search).
