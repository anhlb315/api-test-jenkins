const express = require("express");
const jobController = require("../controllers/jobController");
const { validateJobId } = require("../middlewares/validates/validateJobs");
const { jobsQueryFilter } = require("../middlewares/queryFilters/jobsFilter");
const {
  passJobImages,
  handleUploadImages,
} = require("../middlewares/upload/imageUpload");
const router = express.Router();

router.get("/", jobsQueryFilter, jobController.getAllJobs);
router.get("/:id", validateJobId, jobController.getJobById);

router.post("/", passJobImages, handleUploadImages, jobController.createJob);
router.put("/:id", passJobImages, handleUploadImages, jobController.updateJob);
router.delete("/:id", validateJobId, jobController.deleteJob);

router.get("/import", jobController.importJobsToDB);
router.get("/import/images");

module.exports = router;
