const express = require("express");
const companyController = require("../controllers/companyController");
const router = express.Router();
const {
  uploadFiles,
  handleUploadCompany,
} = require("../middlewares/upload/companyUpload");

router.get("/import", companyController.importCompaniesToDB);
router.get("/", companyController.getAllCompanies);
router.post(
  "/",
  uploadFiles,
  handleUploadCompany,
  companyController.createCompany
);
router.get("/:id", companyController.getCompanyById);
router.get("/:id/comments", companyController.getCompanyComments);
router.post("/:id/comments", companyController.createCompanyComment);
router.get("/:id/applies", companyController.getCompanyApplies);
router.get("/:id/jobs", companyController.getCompanyJobs);
router.get(
  "/:id/statistics/industries",
  companyController.getCompanyStatisticsByIndustry
);
router.get(
  "/:id/statistics/applies",
  companyController.getApplyStatisticsByApply
);

module.exports = router;
