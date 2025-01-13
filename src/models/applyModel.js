module.exports = (sequelize, DataTypes, Model) => {
  class Apply extends Model {}
  Apply.init(
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
      status: {
        type: DataTypes.ENUM,
        values: [
          "pending",
          "accepted-cv-round",
          "accepted-interview-round",
          "rejected",
        ],
        defaultValue: "pending",
        allowNull: false,
      },
      response: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      resume_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "Apply",
      tableName: "applies",
      uniqueKeys: {
        apply_unique: {
          fields: ["job_id", "user_id"],
        },
      },
    }
  );
  return Apply;
};
