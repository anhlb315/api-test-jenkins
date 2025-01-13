module.exports = (sequelize, DataTypes, Model) => {
  class Industry extends Model {}
  Industry.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      industry: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
    },
    {
      sequelize,
      modelName: "Industry",
      tableName: "industries",
    }
  );
  return Industry;
};
