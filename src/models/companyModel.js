module.exports = (sequelize, DataTypes, Model) => {
  class Company extends Model {}

  Company.init(
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
      cover_image: {
        type: DataTypes.STRING,
      },
      location: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      country: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      province_id: {
        type: DataTypes.INTEGER,
      },
      employees: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          min: 1,
        },
      },
      introduction: {
        type: DataTypes.TEXT,
      },
      logo: {
        type: DataTypes.STRING,
      },
      website: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          isUrl: true,
        },
      },
      contact_mail: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true,
        },
      },
      average_salary_rating: {
        type: DataTypes.FLOAT,
        validate: {
          min: 0,
          max: 5,
        },
      },
      average_working_space_rating: {
        type: DataTypes.FLOAT,
        validate: {
          min: 0,
          max: 5,
        },
      },
      average_colleague_rating: {
        type: DataTypes.FLOAT,
        validate: {
          min: 0,
          max: 5,
        },
      },
      average_rating: {
        type: DataTypes.FLOAT,
        validate: {
          min: 0,
          max: 5,
        },
      },
    },
    {
      sequelize,
      modelName: "Company",
      timestamps: false,
      tableName: "companies",
    }
  );

  return Company;
};
