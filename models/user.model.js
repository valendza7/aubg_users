'use strict';

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define("user", {
    user_id: {
        type: DataTypes.BIGINT(10),
        primaryKey: true,
        autoIncrement: true
    },
    first_name: {
        type: DataTypes.STRING(50),
        allowNull: false,
        min: 3
    },
    last_name: {
        type: DataTypes.STRING(50),
        min: 3
    },
    email: {
        type: DataTypes.STRING(100),
        unique: true,
        allowNull: false,
        set(val) {
            this.setDataValue("email", val.toLowerCase())
        },
        min: 10,
        validate: { isEmail: true }
    },
    phone_no: {
        type: DataTypes.BIGINT(10),
        allowNull: false
    },
    gender: {
        type: DataTypes.ENUM,
        values: ['male', 'female', 'others'],
        allowNull: false
    },
    address: {
        type: DataTypes.STRING(100),
        max: 100
    }
  },{
    timestamps: false
  });

  return User;
}