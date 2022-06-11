class AppError extends Error {
    constructor(
        statusCode,
        message,
        isOperational = true,
        error = true,
        stack = ''
    ) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = isOperational;
        this.error = error;
        if (stack) {
            this.stack = stack;
        } else {
            Error.captureStackTrace(this, this.constructor);
        }
    }
}
module.exports = AppError;
