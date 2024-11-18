const validateRequest = (schema) => (req, res, next) => {
  try {
    // Parse and validate request payload
    schema.parse({
      body: req.body,
      params: req.params,
      query: req.query,
    });
    next();
  } catch (error) {
    res.status(400).json({
      errors: error.errors.map((e) => ({
        path: e.path,
        message: e.message,
      })),
    });
  }
};

export default validateRequest;
