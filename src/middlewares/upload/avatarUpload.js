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
    fileSize: 1 * 1024 * 1024, // 2MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true); // Accept image files
    } else {
      cb(new AppError("Only image files are allowed", 400), false); // Reject non-image files
    }
  },
});

const passAvatarImage = upload.single("avatar");

const handleUploadAvatar = catchAsync(async (req, res, next) => {
  if (!req.file) return next();

  const avatarName = `${uuidv4()}.${req.file.mimetype.split("/")[1]}`;

  const params = {
    Bucket: process.env.BUCKET_NAME,
    Key: avatarName,
    Body: req.file.buffer,
    ContentType: req.file.mimetype,
  };

  const command = new PutObjectCommand(params);
  await s3.send(command);

  req.avatarName = avatarName;
  return next();
});

module.exports = { handleUploadAvatar, passAvatarImage };
