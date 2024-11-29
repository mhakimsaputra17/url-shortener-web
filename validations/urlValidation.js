// validations/urlValidation.js
const { check, validationResult } = require('express-validator');

exports.validateUrlCreation = [
  check('originalUrl').isURL().withMessage('Invalid URL format.'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ code: 'INVALID_INPUT', errors: errors.array() });
    }
    next();
  },
];