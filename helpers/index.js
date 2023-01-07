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

module.exports = {
  tryCatchWrapper,
  HttpError,
};
