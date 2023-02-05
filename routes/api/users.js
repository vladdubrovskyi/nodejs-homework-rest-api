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
  updateAvatar,
} = require("../../controllers/authController");
const { auth, upload } = require("../../middlewares/index");

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

authRouter.patch(
  "/users/avatars",
  tryCatchWrapper(auth),
  upload.single("avatar"),
  tryCatchWrapper(updateAvatar)
);

module.exports = authRouter;
