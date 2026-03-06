export class AppError extends Error {
    constructor(message, statusCode, code) {
        super(message);
        this.statusCode = statusCode;
        this.code = code;
        this.isOperational = true;
        Error.captureStackTrace(this, this.constructor);
    }
}

export const errorHandler = (err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const response = {
        success: false,
        error: {
            code: err.code || 'INTERNAL_ERROR',
            message: err.message || 'An unexpected error occurred'
        }
    };

    if (process.env.NODE_ENV === 'development') {
        response.error.stack = err.stack;
    }

    if (err.name === 'ValidationError') { // Mongoose validation error
        response.error.code = 'VALIDATION_ERROR';
        response.error.message = Object.values(err.errors).map(val => val.message).join(', ');
        response.status = 400;
        return res.status(400).json(response);
    }
    
    if (err.name === 'CastError') { // Mongoose incorrect object ID
        response.error.code = 'INVALID_ID';
        response.error.message = `Resource not found with id: ${err.value}`;
        response.status = 404;
        return res.status(404).json(response);
    }

    // Log error for debugging
    if (statusCode >= 500) {
        console.error('❌ Server Error:', err);
    }

    res.status(statusCode).json(response);
};
