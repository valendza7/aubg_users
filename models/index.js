'use strict';
const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const postgres_pass = process.env.MYSQL_PASSWORD
const config = require(__dirname + '/../config/dbconfig.json')[env];
const db = {};
let sequelize = new Sequelize(config.database, config.username, postgres_pass, config);

sequelize
    .authenticate()
    .then(() => {
        console.log("connection established successfully");
    })
    .catch(error => {
        console.log("unable to connect:", error);
    })

fs
  .readdirSync(__dirname)
  .filter(file => {
        return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
    })
  .forEach(file => {
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes)
    db[model.name] = model;
  });

console.log(db);  

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    console.log(modelName);
    db[modelName].associate(db);
  }
});

sequelize.sync()

db.sequelize = sequelize;
db.Sequelize = Sequelize;
module.exports = db;