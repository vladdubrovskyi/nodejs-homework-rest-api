const { MyError } = require("../helpers/index");

function validateBody(schema) {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
      return next(new MyError(error.message, 400));
    }

    return next();
  };
}

module.exports = {
  validateBody,
};
