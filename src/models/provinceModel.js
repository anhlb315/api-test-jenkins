module.exports = (sequelize, DataTypes, Model) => {
  class Province extends Model {}

  Province.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      type: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "Province",
      timestamps: false,
      tableName: "provinces",
    }
  );

  return Province;
};
