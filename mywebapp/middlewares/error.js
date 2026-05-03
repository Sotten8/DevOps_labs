export const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

export const errorHandler = (err, req, res, next) => {
  console.error('API Error:', err.message || err);

  const status = err.status || 500;
  res.status(status).json({
    status: status,
    error: err.message || 'Internal Server Error',
  });
};
