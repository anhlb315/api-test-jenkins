const { Op, Industry } = require("../../models/databaseIndex");
const _ = require("lodash");

exports.jobsQueryFilter = (req, res, next) => {
  const filterObject = _.pickBy({ ...req.query }, _.identity);
  const sequelizeFilterObject = {};

  for (let prop in filterObject) {
    console.log(prop);
    switch (prop) {
      case "companyName":
        sequelizeFilterObject["$Company.name$"] = {
          [Op.like]: `%${filterObject[prop]}%`,
        };
        break;

      case "location":
        sequelizeFilterObject["province_id"] = {
          [Op.eq]: parseInt(filterObject[prop]),
        };
        break;

      case "field":
        sequelizeFilterObject[prop] = {
          [Op.like]: `%${filterObject[prop]}%`,
        };
        break;

      case "industry":
        // Filter by industry using association with Industry model
        sequelizeFilterObject["$Industries.industry$"] = {
          [Op.like]: `%${filterObject[prop]}%`,
        };
        break;

      case "industriesIds":
        // Filter by industry using association with Industry model
        sequelizeFilterObject["$Industries.id$"] = {
          [Op.in]: filterObject[prop].split(","),
        };
        break;

      case "workingMethod":
        sequelizeFilterObject["working_method"] = {
          [Op.like]: `%${filterObject[prop]}%`,
        };
        break;

      case "workingType":
        sequelizeFilterObject["working_type"] = {
          [Op.like]: `%${filterObject[prop]}%`,
        };
        break;

      case "minSalary":
        sequelizeFilterObject["min_salary"] = {
          [Op.gte]: parseInt(filterObject[prop]),
        };
        break;

      case "companyId":
        sequelizeFilterObject["$Company.id$"] = {
          [Op.eq]: parseInt(filterObject[prop]),
        };
        break;

      default:
        break;
    }
  }

  req.query = sequelizeFilterObject;
  next();
};
