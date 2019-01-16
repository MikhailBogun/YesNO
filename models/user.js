'use strict';
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    login: DataTypes.STRING,
    password: DataTypes.STRING,
    salt: DataTypes.STRING,
    face: DataTypes.STRING
  }, {});
  User.associate = function(models) {
    // associations can be defined here
      User.hasMany(models.post,{foreignKey:"voted"})
      User.hasMany(models.closedPost,{foreignKey:"idPerson"})
      User.hasMany(models.follow,{foreignKey:"idPerson"})
      User.hasMany(models.follow,{foreignKey:"idFollows"})
  };
  return User;
};
