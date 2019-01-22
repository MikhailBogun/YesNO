'use strict';
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    login: DataTypes.TEXT,
    password: DataTypes.TEXT,
    salt: DataTypes.TEXT,
    face: DataTypes.TEXT
  }, {});
  User.associate = function(models) {
    // associations can be defined here
      User.hasMany(models.post,{foreignKey:"idUser"})
      User.hasMany(models.post,{as:"test",foreignKey:"idUser"})
      User.hasMany(models.follow,{as:"check",foreignKey:"idFollows"})
      User.hasMany(models.follow,{foreignKey:"idPerson"})

      User.hasMany(models.friends,{foreignKey:"idFriendTwo"})
      User.hasMany(models.friends,{foreignKey:"idFriendOne"})

  };
  return User;
};
