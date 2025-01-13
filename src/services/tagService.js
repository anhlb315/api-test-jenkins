const { Tag } = require("../models/databaseIndex");

class TagService {
  async getAllTags() {
    const tags = await Tag.findAll();
    return tags;
  }
}

module.exports = new TagService();
