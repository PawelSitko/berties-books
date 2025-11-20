// Load environment variables
require('dotenv').config();

// Import modules
var mysql = require('mysql2');
var express = require('express');
var ejs = require('ejs');
const path = require('path');

// Create the express application object
const app = express();
const port = 8000;

// Use EJS as the templating engine
app.set('view engine', 'ejs');

// Set up body parser
app.use(express.urlencoded({ extended: true }));

// Set up public folder
app.use(express.static(path.join(__dirname, 'public')));

// Define app-specific data
app.locals.shopData = { shopName: "Bertie's Books" };

// Define the database connection pool (using dotenv)
const db = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
});

// Make db accessible globally in route files
global.db = db;

// Load the route handlers
const mainRoutes = require("./routes/main");
app.use('/', mainRoutes);

const usersRoutes = require('./routes/users');
app.use('/users', usersRoutes);

const booksRoutes = require('./routes/books');
app.use('/books', booksRoutes);

// Start the server
app.listen(port, () => console.log(`Example app listening on port ${port}!`));
