const multer = require("multer");
const {
  s3,
  PutObjectCommand,
  GetObjectCommand,
} = require("../../services/s3Bucket");
const { v4: uuidv4 } = require("uuid");
const AppError = require("../../utils/appError");
const catchAsync = require("../../utils/catchAsync");

const storage = multer.memoryStorage();

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("application/pdf")) {
      cb(null, true);
    } else {
      cb(new AppError("Only pdf files are allowed", 400), false); // Reject non-image files
    }
  },
});

const passResumePdf = upload.single("resumeFile");

const handleUploadPdf = catchAsync(async (req, res, next) => {
  if (!req.file) return next();

  const resumeName = `${uuidv4()}.pdf`;

  const params = {
    Bucket: process.env.BUCKET_NAME,
    Key: resumeName,
    Body: req.file.buffer,
    ContentType: req.file.mimetype,
  };

  const command = new PutObjectCommand(params);
  await s3.send(command);

  req.resumeName = resumeName;
  return next();
});

module.exports = { handleUploadPdf, passResumePdf };
