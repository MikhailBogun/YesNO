'use strict';
module.exports = (sequelize, DataTypes) => {
  const closedPost = sequelize.define('closedPost', {
    Name: DataTypes.STRING,
    message: DataTypes.STRING,
    image: DataTypes.STRING,
    yes: DataTypes.INTEGER,
    no: DataTypes.INTEGER,
    idPerson: DataTypes.INTEGER
  }, {});
  closedPost.associate = function(models) {
    // associations can be defined here
      closedPost.hasMany(models.privateReactions, {foreignKey:"idPost"})
      closedPost.belongsTo(models.User, {foreignKey:"idPerson"})
  };
  return closedPost;
};
