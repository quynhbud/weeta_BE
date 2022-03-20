const sendSuccess = (res, data, code = 200, message = 'success') => {
  return res.status(code).json({
    message: message,
    data: data,
    code: code,
    error: false
  });
};

const sendError = (res, message) => {
  return res.status(500).json({
    message: message || 'internal server error',
    error: true
  });
};

module.exports = { sendSuccess, sendError };