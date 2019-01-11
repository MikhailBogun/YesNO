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
      User.hasMany(models.PostAll,{foreignKey:"voted"})
  };
  return User;
};
