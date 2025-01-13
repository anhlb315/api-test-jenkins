const express = require("express");
const router = express.Router();
const statisticsController = require("../controllers/statisticController");

router.get("/", statisticsController.getTotalJobsAndAppliedJobsByIndustry);

module.exports = router;
