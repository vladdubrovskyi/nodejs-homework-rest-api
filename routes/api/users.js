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
  verify,
  resendEmail,
} = require("../../controllers/authController");
const { auth, upload, validateBody } = require("../../middlewares/index");
const { ValidateEmailSchema } = require("../../schema/schema");

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

authRouter.get("/users/verify/:verificationToken", tryCatchWrapper(verify));

authRouter.post(
  "/users/verify",
  validateBody(ValidateEmailSchema),
  tryCatchWrapper(resendEmail)
);

module.exports = authRouter;
