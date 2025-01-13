const express = require("express");
const industryController = require("../controllers/industryController");
const router = express.Router();

router.get("/", industryController.getAllIndustries);

module.exports = router;
