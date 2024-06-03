'use strict';

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define("user_profile", {
    user_id: {
        type: DataTypes.BIGINT(10),
        primaryKey: true,
        autoIncrement: true
    },
    file_url: {
        type: DataTypes.STRING(50)
    },
    active: {
        type: DataTypes.INTEGER(1),
        defaultValue: 1
    }
  },{
    timestamps: false
  });

  return User;
}