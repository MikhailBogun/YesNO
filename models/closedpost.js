'use strict';
module.exports = (sequelize, DataTypes) => {
  const closedPost = sequelize.define('closedPost', {
    Name: DataTypes.STRING,
    massage: DataTypes.STRING,
    image: DataTypes.STRING,
    yes: DataTypes.INTEGER,
    no: DataTypes.INTEGER,
    idPerson: DataTypes.STRING
  }, {});
  closedPost.associate = function(models) {
    // associations can be defined here
      closedPost.hasMany(models.privateReactions, {foreignKey:"idPost"})
  };
  return closedPost;
};
