const express = require("express");
const { ContactUpdateSchema } = require("../../schema/schema");
const { ContactSchema } = require("../../schema/schema");
const { FavoriteStatusSchema } = require("../../schema/schema");
const { validateBody } = require("../../middlewares/index");
const { tryCatchWrapper } = require("../../helpers/index");
const {
  getContacts,
  getContact,
  addContact,
  removeContact,
  changeContact,
  updateStatusContact,
} = require("../../controllers/controllers");
const { auth } = require("../../middlewares/index");

const router = express.Router();

router.get("/", tryCatchWrapper(auth), tryCatchWrapper(getContacts));

router.get("/:contactId", tryCatchWrapper(auth), tryCatchWrapper(getContact));

router.post(
  "/",
  tryCatchWrapper(auth),
  validateBody(ContactSchema),
  tryCatchWrapper(addContact)
);

router.delete(
  "/:contactId",
  tryCatchWrapper(auth),
  tryCatchWrapper(removeContact)
);

router.put(
  "/:contactId",
  tryCatchWrapper(auth),
  validateBody(ContactUpdateSchema),
  tryCatchWrapper(changeContact)
);

router.patch(
  "/:contactId/favorite",
  tryCatchWrapper(auth),
  validateBody(FavoriteStatusSchema),
  tryCatchWrapper(updateStatusContact)
);

module.exports = router;
