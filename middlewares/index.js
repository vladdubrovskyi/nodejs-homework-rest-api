const jwt = require("jsonwebtoken");
const { MyError } = require("../helpers/index");
const { User } = require("../models/users");
const { Unauthorized } = require("http-errors");

function validateBody(schema) {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
      return next(new MyError(error.message, 400));
    }

    return next();
  };
}

async function auth(req, res, next) {
  const authHeader = req.headers.authorization || "";
  const [type, token] = authHeader.split(" ");

  if (type !== "Bearer") {
    throw Unauthorized("token type is not valid");
  }

  if (!token) {
    throw Unauthorized("no token provided");
  }

  try {
    const { id } = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(id);

    req.user = user;
  } catch (error) {
    if (
      error.name === "TokenExpiredError" ||
      error.name === "JsonWebTokenError"
    ) {
      throw Unauthorized("jwt token is not valid");
    }
    throw error;
  }

  next();
}

module.exports = {
  validateBody,
  auth,
};
