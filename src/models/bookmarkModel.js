module.exports = (sequelize, DataTypes, Model) => {
  class Bookmark extends Model {}
  Bookmark.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      job_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "Bookmark",
      tableName: "bookmarks",
      uniqueKeys: {
        bookmark_unique: {
          fields: ["job_id", "user_id"],
        },
      },
    }
  );
  return Bookmark;
};
