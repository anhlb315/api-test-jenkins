const multer = require("multer");
const {
  s3,
  PutObjectCommand,
  GetObjectCommand,
} = require("../../services/s3Bucket");
const { v4: uuidv4 } = require("uuid");
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

// Middleware to upload images
const passJobImages = upload.array("images", 3);

// Middleware to handle image upload to S3
const handleUploadImages = catchAsync(async (req, res, next) => {
  const imagesName = [];
  req.imagesName = imagesName;

  if (!req.files || req.files.length === 0) return next();

  const promises = req.files.map(async (file) => {
    const currentImageName = `${uuidv4()}.${file.mimetype.split("/")[1]}`;
    const params = {
      Bucket: process.env.BUCKET_NAME,
      Key: currentImageName,
      Body: file.buffer,
      ContentType: file.mimetype,
    };
    imagesName.push(currentImageName);

    const command = new PutObjectCommand(params);
    await s3.send(command);
  });

  await Promise.all(promises);

  req.imagesName = imagesName;
  return next();
});

module.exports = { handleUploadImages, passJobImages };
