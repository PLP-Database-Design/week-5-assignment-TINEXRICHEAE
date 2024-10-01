// server.js
const express = require('express');
const mysql = require('mysql2');
const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config();

const app = express();

// Create a connection to the database
const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

// Connect to the database
connection.connect((err) => {
  if (err) {
    console.error('Error connecting: ' + err.stack);
    return;
  }
  console.log('Connected as id ' + connection.threadId);
});

// 1. Retrieve all patients
app.get('/patients', (req, res) => {
  connection.query('SELECT patient_id, first_name, last_name, date_of_birth FROM patients', (error, results) => {
    if (error) {
      res.status(500).send('Error querying database');
      return;
    }
    res.json(results);
  });
});

// 2. Retrieve all providers
app.get('/providers', (req, res) => {
  connection.query('SELECT first_name, last_name, provider_specialty FROM providers', (error, results) => {
    if (error) {
      res.status(500).send('Error querying database');
      return;
    }
    res.json(results);
  });
});

// 3. Filter patients by First Name
app.get('/patients/filter/:firstName', (req, res) => {
  const firstName = req.params.firstName;
  connection.query('SELECT * FROM patients WHERE first_name LIKE "%ae%"', [firstName], (error, results) => {
    if (error) {
      res.status(500).send('Error querying database');
      return;
    }
    res.json(results);
  });
});

// 4. Retrieve all providers by their specialty
app.get('/providers/specialty/:specialty', (req, res) => {
  const specialty = req.params.specialty;
  connection.query('SELECT * FROM providers WHERE provider_specialty LIKE "%y"', [specialty], (error, results) => {
    if (error) {
      res.status(500).send('Error querying database');
      return;
    }
    res.json(results);
  });
});

// Listen to the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
