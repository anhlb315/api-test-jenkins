const express = require("express");
const router = express.Router();
const provinceController = require("../controllers/provinceController");

router.get("/import", provinceController.importProvincesToBD);

module.exports = router;
