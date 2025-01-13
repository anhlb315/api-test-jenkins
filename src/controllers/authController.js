const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { promisify } = require("util");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const { User } = require("../models/databaseIndex");
const {
  s3,
  GetObjectCommand,
  DeleteObjectCommand,
  getSignedUrl,
} = require("../services/s3Bucket");

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

exports.signup = catchAsync(async (req, res, next) => {
  const { password, confirmPassword } = req.body;
  if (password !== confirmPassword)
    return next(new AppError("Passwords do not match", 400));

  const hashedPassword = await bcrypt.hash(password, 12);

  const newUser = await User.create({
    ...req.body,
    password: hashedPassword,
  });

  const token = signToken(newUser.id);

  return res.status(201).json({
    status: "success",
    token,
    data: {
      user: newUser,
    },
  });
});

exports.login = catchAsync(async (req, res, next) => {
  const { gmail, password } = req.body;

  if (!gmail || !password)
    return next(new AppError("Please provide email and password", 400));

  const user = await User.findOne({
    where: { gmail },
  });

  const correct = await bcrypt.compare(password, user.password);

  if (!user || !correct)
    return next(new AppError("Incorrect email or password", 401));

  delete user.dataValues.password;

  const token = signToken(user.id);

  if (user.dataValues.avatar) {
    const command = new GetObjectCommand({
      Bucket: process.env.BUCKET_NAME,
      Key: user.avatar,
    });

    const handledUrl = await getSignedUrl(s3, command, {
      expiresIn: 3600 * 24,
    });

    return res.status(200).json({
      status: "success",
      token,
      data: {
        currentUser: {
          id: user.id,
          name: user.name,
          gmail: user.gmail,
          avatar: handledUrl,
          role: user.role,
          date_of_birth: user.date_of_birth,
          company_id: user.company_id,
        },
      },
    });
  }

  return res.status(200).json({
    status: "success",
    token,
    data: {
      currentUser: user,
    },
  });
});

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role))
      return next(
        new AppError("You do not have permission to perform this action", 403)
      );
    return next();
  };
};

exports.protect = catchAsync(async (req, res, next) => {
  // 1) Getting token and check of it's there
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  )
    token = req.headers.authorization.split(" ")[1];

  if (!token)
    return next(new AppError("You are not logged in! Please log in", 401));

  // 2) Verification token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  // 3) Check if user still exists
  const currentUser = await User.findOne({ where: { id: decoded.id } });

  if (!currentUser) return next(new AppError("The user does not exist", 401));

  // 4) Check if user change password after the token was issued

  // if (currentUser.changedPasswordAfter(decoded.iat)) {
  //   return next(
  //     new AppError("User recently changed password! Please login again.", 401)
  //   );
  // }

  //GRANT ACCESS TO THE PROTECTED ROUTE
  req.user = currentUser;

  return next();
});
