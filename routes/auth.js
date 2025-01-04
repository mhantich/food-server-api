
const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");
const { auth } = require("../middleware/auth");
const { registerValidation } = require("../validations/authValidation");
const { register, login, profile, validateToken } = require("../Controller/auth");
const validateRequest = require("../middleware/validateRequest");

router.post(
  '/register',
  registerValidation,
  validateRequest,
  upload.single("profileImage"),
  register
);
router.post("/login", login);
 router.get("/profile", auth, profile);
 router.get(
  "/validate-token",
  auth,
  validateToken
);
module.exports = router;