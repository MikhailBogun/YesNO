'use strict';
module.exports = (sequelize, DataTypes) => {
  const PostAll = sequelize.define('PostAll', {
    Name: DataTypes.STRING,
    massage: DataTypes.STRING,
    image: DataTypes.STRING,
    yes: DataTypes.INTEGER,
    no: DataTypes.INTEGER,
    voted: DataTypes.STRING
  }, {});
  PostAll.associate = function(models) {
    // associations can be defined here
  };
  return PostAll;
};