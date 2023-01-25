const express = require("express");
// // const { ContactUpdateSchema } = require("../../schema/schema");
// // const { ContactSchema } = require("../../schema/schema");
// const { FavoriteStatusSchema } = require("../../schema/schema");
// const { validateBody } = require("../../middlewares/index");
const { tryCatchWrapper } = require("../../helpers/index");
const { register, login } = require("../../controllers/authController");

const authRouter = express.Router();

authRouter.post("/users/register", tryCatchWrapper(register));

authRouter.post("/users/login", tryCatchWrapper(login));

module.exports = authRouter;
