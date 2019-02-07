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
    const Op = sequelize.Sequelize.Op;
  User.associate = function(models) {
    // associations can be defined here
      User.hasMany(models.post,{foreignKey:"idUser"})
      User.hasMany(models.follow,{as:"check",foreignKey:"idFollows"})
      User.hasMany(models.follow,{foreignKey:"idPerson"})


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
    User.prototype.updateCodeEmail = async (email,code)=>{
      return await User.update({
          codeEmail:code
      },
          {where:{
              email:email
              }});
    }
    User.prototype.updatePassword = async (email,code,pass,salt)=>{
        return await User.update({
                password:pass,
                salt:salt
            },
            {
                where:{
                    [Op.and]:[
                        {email:email},
                        {codeEmail:code}
                    ]
                }
            });
    }
  User.prototype.createNewUser = async(data)=>{
      return await User.create(data)
  }
  return User;
};
