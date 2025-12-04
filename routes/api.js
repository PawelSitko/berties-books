// routes/api.js
const express = require("express");
const router = express.Router();

// GET /api/books
// Returns a JSON list of books, with optional filters and sorting:
//   /api/books
//   /api/books?search=world
//   /api/books?minprice=5&max_price=10
//   /api/books?sort=name
//   /api/books?sort=price
router.get("/books", (req, res, next) => {
  // Read query parameters
  const search = req.query.search;              // keyword search in book name
  const minPrice = req.query.minprice;         // min price filter
  const maxPrice = req.query.max_price || req.query.maxprice; // allow both styles
  const sort = req.query.sort;                 // "name" or "price"

  // Base query
  let sqlquery = "SELECT * FROM books";
  let params = [];
  let conditions = [];

  // If a search term is provided, filter by name containing that term
  if (search && search.trim() !== "") {
    conditions.push("name LIKE ?");
    params.push("%" + search.trim() + "%");
  }

  // If a price range is provided, filter by price BETWEEN min and max
  if (minPrice && maxPrice) {
    conditions.push("price BETWEEN ? AND ?");
    params.push(minPrice, maxPrice);
  }

  // If we have any conditions, add WHERE clause
  if (conditions.length > 0) {
    sqlquery += " WHERE " + conditions.join(" AND ");
  }

  // Sorting
  if (sort === "name") {
    sqlquery += " ORDER BY name ASC";
  } else if (sort === "price") {
    sqlquery += " ORDER BY price ASC";
  }

  // Run query
  db.query(sqlquery, params, (err, result) => {
    if (err) {
      // Return error as JSON
      res.status(500).json({ error: "Database error", details: err });
      return next(err);
    }

    // Return books as JSON
    res.json(result);
  });
});

module.exports = router;
