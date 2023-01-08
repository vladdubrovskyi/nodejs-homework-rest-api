const { MyError } = require("../helpers/index");

function validateBody(schema) {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
      return next(new MyError((error.message = "missing required field"), 400));
    }

    return next();
  };
}

module.exports = {
  validateBody,
};
