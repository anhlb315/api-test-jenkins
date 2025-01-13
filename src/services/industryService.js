const { Industry } = require("../models/databaseIndex");

class IndustryService {
  async getAllIndustries() {
    const industries = await Industry.findAll();
    return industries;
  }
}

module.exports = new IndustryService();
