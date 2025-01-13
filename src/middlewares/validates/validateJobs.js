const { param } = require("express-validator");

exports.validateJobId = [
  param("id").custom((value, { req }) => {
    const id = parseInt(value);
    req.params.id = id;

    if (!Number.isNaN(id) && id >= 0) return true;
    else
      throw new Error("Job ID must be a number greater than or equal to zero");
  }),
];
