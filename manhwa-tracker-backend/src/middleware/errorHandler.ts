const errorHandler = (err, req, res, next) => {
  // Mongoose validation error
  if (err.name === "ValidationError") {
    const message = Object.values(err.errors)[0].message;
    return res.status(400).json({
      success: false,
      message,
    });
  }

  // Duplicate key error (unique index)
  if (err.code === 11000) {
    return res.status(409).json({
      success: false,
      message: "Manhwa already in your list",
    });
  }

  const statusCode = err.status || 500;

  if (process.env.NODE_ENV === "development") {
    console.error(err.stack);
  }

  res.status(statusCode).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
};

export default errorHandler;