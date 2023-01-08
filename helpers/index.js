function tryCatchWrapper(endpointFn) {
  return async (req, res, next) => {
    try {
      await endpointFn(req, res, next);
    } catch (error) {
      return next(error);
    }
  };
}

class MyError extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
  }
}

module.exports = {
  tryCatchWrapper,
  MyError,
};
