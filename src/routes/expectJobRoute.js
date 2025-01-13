const express = require("express");
const expectJobController = require("../controllers/expectJobController");
const router = express.Router();

router.post("/", expectJobController.createNewExpectJob);
router.get("/", expectJobController.getAllExpectJob);

module.exports = router;
