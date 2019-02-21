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
      User.hasMany(models.post,{as:"test",foreignKey:"idUser"})
      User.hasMany(models.follow,{as:"iSigned",foreignKey:"idFollows"})
      User.hasMany(models.follow,{foreignKey:"idPerson"})


  }

  User.prototype.showFriends = async(offset,user,relationship,searchText=null) => {
      let options ={}
       options.include = [{
              model: sequelize.models.follow,
              attributes:[],
              where:{
                  [Op.and]: [
                      {idFollows: user},
                      {relationship: relationship}
                            ]
                    }
                    }]

      if(relationship==0){
          options.include= [{
              model: sequelize.models.follow,
              as: 'iSigned',
              attributes: [],
              where: {
                  [Op.and]: [
                      {idPerson: user},
                      {relationship: 1}
                  ]
              }
          }]
      } else if(relationship==3){
          options={}
          options.attributes = ["login", "face", "id"];
          if(searchText && offset=="length"){
              return await sequelize.query(`
                    SELECT  COUNT("id") FROM "Users" AS "User" WHERE "User"."login" ILIKE :search_login;
              `,
                  { replacements: {   search_login: '%'+searchText+"%"},
                      type: sequelize.QueryTypes.SELECT })
              // await sequelize.query(`
              //       SELECT "login", "face", "id" FROM "Users" AS "User" LIMIT 5 OFFSET '0';
              // `)
          } else if (searchText) {
              return await sequelize.query(`
                    SELECT "id","login","face" FROM "Users" AS "User" WHERE "User"."login" ILIKE :search_login LIMIT 5 OFFSET :offset;
              `,
                  { replacements: {   search_login: '%'+searchText+"%", offset:offset},
                      type: sequelize.QueryTypes.SELECT })
          }
      }

        if(offset=="length"){
            options.attributes = []
            console.log(await User.count(options))
            return await User.count(options)

        } else {
            options.attributes = ["login", "face", "id"];
            options.offset= offset;
            options.limit = 5
            options.subQuery = false;
            return await User.findAll(options)
        }


  }

  User.prototype.checkUser = async (id) => {
      return await User.findById(id,{
          attributes:['login']
      });
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

  User.prototype.newFace = async(id,filename) => {
     return await User.update({face:"public/images/persons/"+filename},
          {
              where: {
                  id:id
              }
          })
  }

  User.prototype.removePassword = async (oldPass,newPass,id) => {
      let checkPass = await User.findById(id,{
          attributes:["salt","password"]
      });

      let password = bcrypt.hashSync(oldPass,checkPass.salt);

      if(password===checkPass.password) {

          let newSalt = bcrypt.genSaltSync(10);
          let hashPass = bcrypt.hashSync(newPass, newSalt)
          return await User.update({
                  password: hashPass,
                  salt: newSalt
              },
              {
                  where: {id: id}
              })
      } else {
          return await null;
      }

  }
  // User.prototype.showFriends= async(query)=>{
  //     const options = {
  //         include: [{
  //             model: db.follow,
  //             attributes: [],
  //             where: {
  //                 [Op.and]: [
  //                     {idFollows: user},
  //                     {relationship: 2}
  //                 ]
  //             },
  //         }]
  //     }
  //     if(query.offset == "length"){
  //
  //     }
  // }

  return User;
};
