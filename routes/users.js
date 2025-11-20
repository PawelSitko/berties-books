const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const db = global.db;
const saltRounds = 10;

router.get('/register', (req, res) => {
    res.render('register.ejs');
});

// REGISTER USER
router.post('/registered', (req, res) => {
    const first = req.body.first;
    const last = req.body.last;
    const email = req.body.email;
    const username = req.body.username;
    const plainPassword = req.body.password;

    bcrypt.hash(plainPassword, saltRounds, (err, hashedPassword) => {
        if (err) return res.send("Error hashing password.");

        const sql = "INSERT INTO users (first, last, email, username, password) VALUES (?, ?, ?, ?, ?)";
        const values = [first, last, email, username, hashedPassword];

        db.query(sql, values, (err, result) => {
            if (err) return res.send("Database error");

            let message = `Hello ${first} ${last}, you are now registered! `;
            message += `Your password is: ${plainPassword} and your hashed password is: ${hashedPassword}`;
            res.send(message);
        });
    });
});

// LIST USERS
router.get('/list', (req, res) => {
    db.query("SELECT * FROM users", (err, result) => {
        if (err) return res.send("Database error");
        res.render("userlist.ejs", { users: result });
    });
});

// LOGIN PAGE
router.get('/login', (req, res) => {
    res.render('login.ejs');
});

// LOGIN + AUDIT LOGGING
router.post('/loggedin', (req, res) => {
    const username = req.body.username;
    const plainPassword = req.body.password;

    const sql = "SELECT * FROM users WHERE username = ?";
    db.query(sql, [username], (err, results, fields) => {

        if (err) {
            db.query("INSERT INTO audit_log (username, status) VALUES (?, ?)", 
                [username, "failure"]);
            return res.send("Database error");
        }

        if (results.length === 0) {
            db.query("INSERT INTO audit_log (username, status) VALUES (?, ?)", 
                [username, "failure"]);
            return res.send("Login failed: Username not found.");
        }

        const storedHash = results[0].password;

        bcrypt.compare(plainPassword, storedHash, (err, isMatch) => {

            if (err) {
                db.query("INSERT INTO audit_log (username, status) VALUES (?, ?)", 
                    [username, "failure"]);
                return res.send("Error comparing passwords.");
            }

            if (isMatch) {
                db.query("INSERT INTO audit_log (username, status) VALUES (?, ?)", 
                    [username, "success"]);
                res.send(`Login successful! Welcome, ${results[0].first} ${results[0].last}.`);
            } else {
                db.query("INSERT INTO audit_log (username, status) VALUES (?, ?)", 
                    [username, "failure"]);
                res.send("Login failed: Incorrect password.");
            }
        });
    });
});

// VIEW AUDIT LOG
router.get('/audit', (req, res) => {
    db.query("SELECT * FROM audit_log ORDER BY timestamp DESC", (err, result) => {
        if (err) return res.send("Database error");
        res.render("audit.ejs", { logs: result });
    });
});

module.exports = router;
