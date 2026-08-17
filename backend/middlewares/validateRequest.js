const validateRequest = (schema) => (req, res, next) => {
  const result = schema.safeParse({
    body: req.body,
    params: req.params,
    query: req.query,
  });

  if (!result.success) {
    return res.status(400).json({
      error: result.error.errors[0]?.message || "Invalid request data.",
      errors: result.error.errors.map((e) => ({
        path: e.path.join("."),
        message: e.message,
      })),
    });
  }

  // Use the parsed output: unknown keys are stripped, so a client cannot inject
  // extra fields (e.g. has_paid) into a Prisma call.
  if (result.data.body) req.body = result.data.body;
  next();
};

export default validateRequest;
