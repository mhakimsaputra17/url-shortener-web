const { nanoid } = require('nanoid');
const Url = require('../models/urlModel');
const QRCode = require('qrcode');

// Create a shortened URL
exports.createShortUrl = async (req, res) => {
  try {
    const { originalUrl } = req.body;
    const shortCode = nanoid(8);
    const shortUrl = `${req.protocol}://${req.get('host')}/${shortCode}`;
    
    // Generate QR code
    const qrCode = await QRCode.toDataURL(shortUrl, {
      width: 400,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#ffffff'
      }
    });

    const url = await Url.create({
      originalUrl,
      shortCode,
      shortUrl,
      qrCode,
      visitCount: 0
    });

    res.status(201).json({
      status: 'success',
      data: url
    });
  } catch (err) {
    console.error('Create URL error:', err);
    res.status(500).json({
      status: 'error',
      message: 'Error creating short URL'
    });
  }
};

// Redirect to the original URL
exports.redirectToOriginalUrl = async (req, res, next) => {
  try {
    const { shortCode } = req.params;
    const url = await Url.findOne({ shortCode });

    if (url) {
      // Increment visit count
      url.visitCount += 1;
      await url.save();

      // Redirect to the original URL
      res.redirect(url.originalUrl);
    } else {
      res.status(404).json({
        code: 'NOT_FOUND',
        message: 'No URL found for the provided short code.',
      });
    }
  } catch (err) {
    next(err);
  }
};

// Get URL statistics
exports.getUrlStatistics = async (req, res, next) => {
  try {
    const { shortCode } = req.params;
    const url = await Url.findOne({ shortCode });

    if (url) {
      res.status(200).json({
        id: url._id,
        originalUrl: url.originalUrl,
        shortCode: url.shortCode,
        shortUrl: `${req.protocol}://${req.get('host')}/${url.shortCode}`,
        visitCount: url.visitCount,
        createdAt: url.createdAt,
      });
    } else {
      res.status(404).json({
        code: 'NOT_FOUND',
        message: 'No URL found for the provided short code.',
      });
    }
  } catch (err) {
    next(err);
  }
};

// Update deleteShortUrl controller
exports.deleteShortUrl = async (req, res) => {
  try {
    const { shortCode } = req.params;
    console.log('Attempting to delete URL with shortCode:', shortCode); // Add logging

    if (!shortCode) {
      return res.status(400).json({
        status: 'error',
        message: 'Short code is required'
      });
    }

    const url = await Url.findOne({ shortCode });
    if (!url) {
      return res.status(404).json({
        status: 'error',
        message: 'URL not found'
      });
    }

    await Url.deleteOne({ shortCode });
    console.log('URL deleted successfully'); // Add logging
    
    return res.status(204).send();
  } catch (error) {
    console.error('Delete error:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Error deleting URL'
    });
  }
};

// List all URLs with pagination
exports.listAllUrls = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const totalItems = await Url.countDocuments();
    const totalPages = Math.ceil(totalItems / limit);

    const urls = await Url.find()
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ createdAt: -1 });

    res.status(200).json({
      data: urls.map((url) => ({
        id: url._id,
        originalUrl: url.originalUrl,
        shortCode: url.shortCode,
        shortUrl: `${req.protocol}://${req.get('host')}/${url.shortCode}`,
        qrCode: url.qrCode,
        visitCount: url.visitCount,
        createdAt: url.createdAt,
      })),
      pagination: {
        totalItems,
        totalPages,
        currentPage: page,
        pageSize: limit,
      },
    });
  } catch (err) {
    next(err);
  }
};

// Add getQRCode endpoint
exports.getQRCode = async (req, res) => {
  try {
    const { shortCode } = req.params;
    const url = await Url.findOne({ shortCode });

    if (!url) {
      return res.status(404).json({
        status: 'error',
        message: 'URL not found'
      });
    }

    // Create the full URL for QR code
    const fullUrl = `${process.env.BASE_URL || 'http://localhost:3000'}/${shortCode}`;

    // Generate QR code with higher quality
    const qrCode = await QRCode.toDataURL(fullUrl, {
      width: 800, // Increased size
      margin: 2,
      color: {
        dark: '#000000',
        light: '#ffffff'
      },
      errorCorrectionLevel: 'H' // Highest error correction
    });

    // Convert base64 to buffer and send as image
    const qrBuffer = Buffer.from(qrCode.split(',')[1], 'base64');
    
    // Set proper headers for image download
    res.setHeader('Content-Type', 'image/png');
    res.setHeader('Content-Disposition', `inline; filename="qr-code-${shortCode}.png"`);
    res.setHeader('Cache-Control', 'public, max-age=86400');
    res.send(qrBuffer);

  } catch (error) {
    console.error('QR Code error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error generating QR code'
    });
  }
};

// Add deleteAllUrls controller
exports.deleteAllUrls = async (req, res) => {
  try {
    console.log('Attempting to delete all URLs');
    const result = await Url.deleteMany({});
    console.log('Delete all result:', result);

    if (result.deletedCount === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'No URLs found to delete'
      });
    }

    return res.status(204).send();
  } catch (error) {
    console.error('Delete all error:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Error deleting all URLs'
    });
  }
};