module.exports = (sequelize, DataTypes, Model) => {
  class Job extends Model {}

  Job.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      company_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      min_salary: {
        type: DataTypes.BIGINT,
        allowNull: false,
        validate: {
          min: 0,
        },
      },
      max_salary: {
        type: DataTypes.BIGINT,
        allowNull: false,
        validate: {
          min: 0,
          greaterThanMinSalary(value) {
            if (
              value <= this.min_salary &&
              value !== null &&
              this.min_salary !== null
            ) {
              throw new Error("Max salary must be greater than min salary");
            }
          },
        },
      },
      recruitment_number: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          min: 1,
        },
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
        defaultValue: "offline",
      },
      working_type: {
        type: DataTypes.ENUM,
        values: ["fulltime", "partime"],
        defaultValue: "fulltime",
        allowNull: false,
      },
      expired_date: {
        type: DataTypes.DATE,
        validate: {
          isAfter: new Date().toISOString(),
        },
      },
      start_week_day: {
        type: DataTypes.INTEGER,
        defaultValue: 2,
        validate: {
          min: 2,
          max: 8,
        },
      },
      end_week_day: {
        type: DataTypes.INTEGER,
        defaultValue: 6,
        validate: {
          min: 2,
          max: 8,
          lowerThanStart(value) {
            if (value <= this.start_week_day && this.start_week_day !== null) {
              throw new Error(
                "End week day must be greater than start week day"
              );
            }
          },
        },
      },
      degree: {
        type: DataTypes.ENUM,
        values: [
          "Thực tập sinh",
          "Nhân viên",
          "Trưởng nhóm",
          "Giám đốc",
          "Tổng giám đốc",
        ],
        defaultValue: "Nhân viên",
      },
      gender: {
        type: DataTypes.ENUM,
        values: ["male", "female"],
      },
      province_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "Job",
      tableName: "jobs",
    }
  );

  return Job;
};
