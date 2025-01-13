const multer = require("multer");
const { s3, PutObjectCommand } = require("../../services/s3Bucket");
const { v4: uuidv4 } = require("uuid");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const AppError = require("../../utils/appError");
const catchAsync = require("../../utils/catchAsync");

// Define multer storage
const storage = multer.memoryStorage();

// Define multer upload instance with file size and file type restrictions
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 2 * 1024 * 1024, // 2MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true); // Accept image files
    } else {
      cb(new AppError("Only image files are allowed", 400), false); // Reject non-image files
    }
  },
});

const uploadFiles = upload.fields([
  { name: "logo", maxCount: 1 },
  { name: "cover_image", maxCount: 1 },
]);

const handleUploadCompany = catchAsync(async (req, res, next) => {
  const logoFile = req.files.logo ? req.files.logo[0] : null;
  const coverImageFile = req.files.cover_image
    ? req.files.cover_image[0]
    : null;

  if (!logoFile && !coverImageFile) return next();

  if (logoFile) {
    const logoFileName = `${uuidv4()}.${logoFile.mimetype.split("/")[1]}`;

    const logoParams = {
      Bucket: process.env.BUCKET_NAME,
      Key: logoFileName,
      Body: logoFile.buffer,
      ContentType: logoFile.mimetype,
    };

    const logoCommand = new PutObjectCommand(logoParams);
    await s3.send(logoCommand);

    req.body.logoUrl = logoFileName;
  }

  if (coverImageFile) {
    const coverImageFileName = `${uuidv4()}.${
      coverImageFile.mimetype.split("/")[1]
    }`;

    const coverImageParams = {
      Bucket: process.env.BUCKET_NAME,
      Key: coverImageFileName,
      Body: coverImageFile.buffer,
      ContentType: coverImageFile.mimetype,
    };

    const coverImageCommand = new PutObjectCommand(coverImageParams);
    await s3.send(coverImageCommand);

    req.body.coverImageUrl = coverImageFileName;
  }

  return next();
});

module.exports = { handleUploadCompany, uploadFiles };
