'use strict';

module.exports = (sequelize, DataTypes) => {
  class Type extends sequelize.Sequelize.Model{ }
  Type.init({
    id: {
      type: DataTypes.INTGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    type: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
  }, {
    sequelize,
    timestamps: true,
    paranoid: true,
  });

  return Type;
};
