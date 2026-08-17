// Wraps an async controller so a rejected promise reaches the error middleware
// instead of hanging the request.
const asyncHandler = (handler) => (req, res, next) =>
  Promise.resolve(handler(req, res, next)).catch(next);

export default asyncHandler;
