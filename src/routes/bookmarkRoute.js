const express = require("express");
const companyController = require("../controllers/bookmarkController");
const router = express.Router();

router.delete("/:id", companyController.deleteBookmark);

module.exports = router;
