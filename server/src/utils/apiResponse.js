export const successResponse = (res, data, message = 'Success', statusCode = 200) => {
    return res.status(statusCode).json({
        success: true,
        message,
        data
    });
};

export const errorResponse = (res, message = 'Internal Server Error', statusCode = 500, code = 'SERVER_ERROR') => {
    return res.status(statusCode).json({
        success: false,
        error: {
            code,
            message
        }
    });
};
