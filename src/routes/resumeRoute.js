const express = require("express");
const router = express.Router();
const resumeController = require("../controllers/resumeController");
const {
  passResumePdf,
  handleUploadPdf,
} = require("../middlewares/upload/pdfUpload");

router.get("/", resumeController.getAllResumes);
router.get("/:id", resumeController.getResumeById);
router.post("/", resumeController.createResume);

router.post(
  "/upload",
  passResumePdf,
  handleUploadPdf,
  resumeController.uploadResume
);

module.exports = router;
