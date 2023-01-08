function tryCatchWrapper(endpointFn) {
  return async (req, res, next) => {
    try {
      await endpointFn(req, res, next);
    } catch (error) {
      return next(error);
    }
  };
}

function HttpError(status, message) {
  const error = new Error(message);
  error.status = status;
  return error;
}

class MyError extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
  }
}

function hanldeError(message, status) {
  throw new MyError(message, status);
}

module.exports = {
  tryCatchWrapper,
  HttpError,
  hanldeError,
};
