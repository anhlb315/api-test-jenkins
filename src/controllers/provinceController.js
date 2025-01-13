const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const { Province } = require("../models/databaseIndex");
const provinceData = require("../constant/provinceData");

exports.importProvincesToBD = catchAsync(async (req, res, next) => {
  // return;
  const provinces = provinceData.map((province) => {
    return {
      id: parseInt(province.province_id),
      name: province.province_name,
      type: province.province_type,
    };
  });
  const newProvinces = await Province.bulkCreate(provinces);
  res.status(201).json({
    status: "success",
    data: {
      provinces: newProvinces,
    },
  });
});
