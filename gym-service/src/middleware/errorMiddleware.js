function errorHandler(err, req, res, next) {
    console.error(err);
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({
        message: err.message || 'Internal Server Error',
        stack: process.env.NODE_ENV === 'production' ? null : err.stack
    });
}

module.exports = errorHandler;
