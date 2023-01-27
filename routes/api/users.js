const express = require("express");
// // const { ContactUpdateSchema } = require("../../schema/schema");
// // const { ContactSchema } = require("../../schema/schema");
// const { FavoriteStatusSchema } = require("../../schema/schema");
// const { validateBody } = require("../../middlewares/index");
const { tryCatchWrapper } = require("../../helpers/index");
const {
  register,
  login,
  logout,
  current,
} = require("../../controllers/authController");
const { auth } = require("../../middlewares/index");

const authRouter = express.Router();

authRouter.post("/users/register", tryCatchWrapper(register));

authRouter.post("/users/login", tryCatchWrapper(login));

authRouter.post(
  "/users/logout",
  tryCatchWrapper(auth),
  tryCatchWrapper(logout)
);
authRouter.get(
  "/users/current",
  tryCatchWrapper(auth),
  tryCatchWrapper(current)
);

module.exports = authRouter;
