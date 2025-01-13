module.exports = (sequelize, DataTypes, Model) => {
  class Chat extends Model {}
  Chat.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      sender_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      receiver_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      message: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "Chat",
      tableName: "chats",
    }
  );
  return Chat;
};
