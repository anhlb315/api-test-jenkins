module.exports = (sequelize, DataTypes, Model) => {
  class Resume extends Model {}

  Resume.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING,
      },
      data: {
        type: DataTypes.JSON,
      },
      resume_url: {
        type: DataTypes.STRING,
      },
      is_uploaded: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
    },
    {
      sequelize,
      modelName: "Resume",
      timestamps: false,
      tableName: "resumes",
    }
  );

  return Resume;
};
