// Small helper so controllers can throw meaningful HTTP errors and let the
// central error middleware turn them into a JSON response.
export class HttpError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

export const badRequest = (message = "Bad request") => new HttpError(400, message);
export const unauthorized = (message = "Unauthorized") => new HttpError(401, message);
export const forbidden = (message = "Forbidden") => new HttpError(403, message);
export const notFound = (message = "Not found") => new HttpError(404, message);

// Every :id param arrives as a string. Reject anything that is not a positive
// integer instead of handing NaN to Prisma (which answers with a 500).
export const parseId = (value, label = "id") => {
  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed <= 0) {
    throw badRequest(`Invalid ${label}.`);
  }
  return parsed;
};

export default HttpError;
