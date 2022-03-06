const sendSuccess = (res, data, code = 200, message = 'success') => {
  return res.status(code).json({
    message: message,
    data: data,
    code: code,
  });
};

const sendError = (res, message) => {
  return res.status(500).json({
    message: message || 'internal server error',
  });
};

module.exports = { sendSuccess, sendError };