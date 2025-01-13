module.exports = (sequelize, DataTypes, Model) => {
  class User extends Model {}
  User.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          len: [8, 255],
        },
      },
      gmail: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true,
        },
      },
      role: {
        type: DataTypes.ENUM,
        values: ["user", "agent", "admin"],
        defaultValue: "user",
        allowNull: false,
      },
      avatar: {
        type: DataTypes.STRING,
      },
      date_of_birth: {
        type: DataTypes.DATE,
      },
      company_id: {
        type: DataTypes.INTEGER,
      },
    },
    {
      sequelize,
      modelName: "User",
      timestamps: false,
      tableName: "users",
    }
  );
  return User;
};
