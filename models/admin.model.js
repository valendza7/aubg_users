'use strict';

module.exports = (sequelize, DataTypes) => {
  const Admin = sequelize.define("admin", {
    admin_id: {
        type: DataTypes.BIGINT(10),
        primaryKey: true,
        autoIncrement: true
    },
    username: {
        type: DataTypes.STRING(20)
    },
    password: {
        type: DataTypes.STRING(100)
    }
  },{
    timestamps: false
  });

  return Admin;
}