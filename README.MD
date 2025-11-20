# Bertie's Books – Web Application  
Student ID: 33788775  

This project is a Node.js + Express + MySQL web application for Bertie’s Books.  
It includes user registration, secure password hashing, login authentication,  
audit logging, deployment on the department VM, and environment variable protection.

---

## 1. Project Overview
The application allows users to:
- Register with hashed passwords
- Log in securely
- View books stored in the database
- Log successful and failed login attempts (audit log)
- View the audit log on a protected route

---

## 2. dotenv (Securing Database Credentials)
To avoid storing database credentials in the source code, the `dotenv` module is used.

### How it works
1. Installed using:
npm install dotenv
2. At the top of `index.js`:
```js
3. require('dotenv').config();
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=berties_books
4. The database pool uses environment variables:
const db = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});
This ensures database passwords are never exposed in GitHub, which is required for secure deployment.

3. Audit Logging
To improve application security, an audit log feature was implemented.
What is logged
Successful logins (status = "success")
Failed logins (wrong password or unknown username)
Storage

A table called audit_log stores:
id
username
status
timestamp (automatic)

How it works:
During login:
INSERT INTO audit_log (username, status) VALUES (?, ?)
Every login attempt (success or failure) is recorded.

Viewing the audit log
A route /users/audit displays all login attempts (newest first).

4. Default Login (Required for Marking)

A default account was added to insert_test_data.sql:

Username: gold

Password: smiths

The password is stored as a bcrypt hash:
$2b$10$1DI5d2uQFz71sFqJWCY/7eUgGyDaP5yS4PbhavJA0rJpY3UJprlPe
This user is inserted automatically when the app is deployed on the VM.

5. Deployment on VM

SSH into the VM

Pull the repository:
git pull

Install dependencies:
npm install

4. Ensure MySQL database + tables are created:
source create_db.sql;

5. Insert test data (including default login):
source insert_test_data.sql;

6. Running the App Forever

To ensure the application stays running even after logout:

Install forever
sudo npm install -g forever

Start the application
forever start index.js
