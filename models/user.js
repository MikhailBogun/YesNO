'use strict';
const bcrypt = require('bcrypt');
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    login: DataTypes.TEXT,
    password: DataTypes.TEXT,
    salt: DataTypes.TEXT,
    face: DataTypes.TEXT,
      email: DataTypes.TEXT,
      codeEmail: DataTypes.INTEGER
  });
  User.associate = function(models) {
    // associations can be defined here
      User.hasMany(models.post,{foreignKey:"idUser"})
      User.hasMany(models.follow,{as:"check",foreignKey:"idFollows"})
      User.hasMany(models.follow,{foreignKey:"idPerson"})

      User.hasMany(models.friends,{foreignKey:"idFriendTwo"})
      User.hasMany(models.friends,{foreignKey:"idFriendOne"})

  }

  User.prototype.oneUser = async (email)=>{
      let person = await User.findOne({
          attributes:["id","salt","password"],
          where: {
              email: email
                }
            });
      return await person
  }

  User.prototype.createNewUser = async(data)=>{
      return await User.create(data)
  }
  return User;
};
