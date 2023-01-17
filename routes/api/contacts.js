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

const router = express.Router();

router.get("/", tryCatchWrapper(getContacts));

router.get("/:contactId", tryCatchWrapper(getContact));

router.post("/", validateBody(ContactSchema), tryCatchWrapper(addContact));

router.delete("/:contactId", tryCatchWrapper(removeContact));

router.put(
  "/:contactId",
  validateBody(ContactUpdateSchema),
  tryCatchWrapper(changeContact)
);

router.patch(
  "/:contactId/favorite",
  validateBody(FavoriteStatusSchema),
  tryCatchWrapper(updateStatusContact)
);

module.exports = router;
