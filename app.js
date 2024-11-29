// app.js
require('dotenv').config();
const express = require('express');
const app = express();
const urlRoutes = require('./routes/urlRoutes');
const errorHandler = require('./middlewares/errorHandler');
const connectDB = require('./config/db');
const urlController = require('./controllers/urlController'); // Import the urlController
const path = require("path");



// Connect to the database
connectDB();

// Middleware
app.use(express.json());

// EJS configuration
app.set('view engine', 'ejs');
// app.set('views', './views');
app.set('views',path.join(__dirname,'views'));
// app.use(express.static('public'));
app.use(express.urlencoded({extended:false}));
app.use(express.static(path.join(__dirname,'public')));


// Web interface Route
app.get('/', (req, res) => {
    res.render('index');
});

// API routes - Update this section
app.use('/api/v1/urls', urlRoutes);

// Redirect Route - Keep this after API routes
app.get('/:shortCode', urlController.redirectToOriginalUrl);

// Error Handling Middleware
app.use(errorHandler);

module.exports = app;