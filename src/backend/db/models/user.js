'use strict';

module.exports = (sequelize, DataTypes) => {
  class User extends sequelize.Sequelize.Model { }
  User.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    userName: {
      type: DataTypes.string(100),
      allowNull: false,
    },
    email: {
      type: DataTypes.string(100),
      allowNull: false,
    },
    password: {
      type: DataTypes.string(60),
      allowNull: false,
    },
    avatar: {
      type: DataTypes.text,
      allowNull: true,
    }
  }, {
    sequelize,
    timestamps: true,
    paranoid: true,
  });

  return User;
};
