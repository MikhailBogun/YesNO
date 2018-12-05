'use strict';
module.exports = (sequelize, DataTypes) => {
  const follows = sequelize.define('follows', {
    idPerson: DataTypes.STRING,
    idFollows: DataTypes.STRING
  }, {});
  follows.associate = function(models) {
    // associations can be defined here
  };
  return follows;
};