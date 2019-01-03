'use strict';
module.exports = (sequelize, DataTypes) => {
  const privatePosts = sequelize.define('privatePosts', {
    name: DataTypes.STRING,
    message: DataTypes.STRING,
    image: DataTypes.STRING,
    yes: DataTypes.INTEGER,
    no: DataTypes.INTEGER,
    voted: DataTypes.STRING
  }, {});
  privatePosts.associate = function(models) {
    // associations can be defined here
  };
  return privatePosts;
};