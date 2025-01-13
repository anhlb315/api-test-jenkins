module.exports = (sequelize, DataTypes, Model) => {
  class ExpectJob extends Model {}

  ExpectJob.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true,
      },
      min_salary: {
        type: DataTypes.BIGINT,
        validate: {
          min: 0,
        },
      },
      industries: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      working_experience: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        validate: {
          min: 0,
        },
      },
      working_method: {
        type: DataTypes.ENUM,
        values: ["offline", "remote", "hybrid"],
        // defaultValue: "offline",
        allowNull: true,
      },
      working_type: {
        type: DataTypes.ENUM,
        values: ["fulltime", "partime"],
        defaultValue: "fulltime",
        allowNull: true,
      },
      province_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      skills: {
        type: DataTypes.TEXT,
      },
    },
    {
      sequelize,
      modelName: "ExpectJob",
      tableName: "expect_jobs",
    }
  );

  return ExpectJob;
};
