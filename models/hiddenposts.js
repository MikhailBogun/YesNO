'use strict';
module.exports = (sequelize, DataTypes) => {
  const hiddenPosts = sequelize.define('hiddenPosts', {
    Name: DataTypes.STRING,
    massage: DataTypes.STRING,
    image: DataTypes.STRING,
    yes: DataTypes.INTEGER,
    no: DataTypes.INTEGER,
    voted: DataTypes.STRING
  }, {});
  hiddenPosts.associate = function(models) {
    // associations can be defined here
  };
  return hiddenPosts;
};