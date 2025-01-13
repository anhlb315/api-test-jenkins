const express = require("express");
const applyController = require("../controllers/applyController");
const router = express.Router();

router.patch("/:id", applyController.updateApply);
router.delete("/:id", applyController.deleteApply);

module.exports = router;
