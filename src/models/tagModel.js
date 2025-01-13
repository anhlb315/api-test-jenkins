module.exports = (sequelize, DataTypes, Model) => {
  class Tag extends Model {}
  Tag.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      tag: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
    },
    {
      sequelize,
      modelName: "Tag",
      tableName: "tags",
    }
  );
  return Tag;
};
