// routes/urlRoutes.js
const express = require('express');
const router = express.Router();
const urlController = require('../controllers/urlController');
const { validateUrlCreation } = require('../validations/urlValidation');

// Add deleteAll route first to avoid conflicts with other routes
router.delete('/all', urlController.deleteAllUrls);

// Put specific routes first
router.get('/', urlController.listAllUrls);
router.post('/', validateUrlCreation, urlController.createShortUrl);
router.get('/:shortCode/qrcode', urlController.getQRCode);
router.get('/:shortCode/stats', urlController.getUrlStatistics);
router.delete('/:shortCode', urlController.deleteShortUrl); // Ensure this route is properly ordered

module.exports = router;