module.exports = (sequelize, DataTypes, Model) => {
  class JobImage extends Model {}
  JobImage.init(
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
      image: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "JobImage",
      timestamps: false,
      tableName: "job_images",
    }
  );
  return JobImage;
};
