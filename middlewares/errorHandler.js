// middlewares/errorHandler.js
module.exports = (err, req, res, next) => {
    console.error(err.stack);
  
    const statusCode = err.statusCode || 500;
    const code = err.code || 'SERVER_ERROR';
    const message = err.message || 'An unexpected error occurred.';
  
    res.status(statusCode).json({ code, message });
  };