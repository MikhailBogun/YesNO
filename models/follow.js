'use strict';
module.exports = (sequelize, DataTypes) => {
  const follow = sequelize.define('follow', {
    idPerson: DataTypes.INTEGER,
    idFollows: DataTypes.INTEGER,
      relationship:DataTypes.INTEGER

  });
    const Op = sequelize.Sequelize.Op;
  follow.associate = function(models) {
    // associations can be defined here
      follow.belongsTo(models.User, {foreignKey:'idPerson'})
      follow.belongsTo(models.User, {foreignKey:'idFollows'})
  };
    follow.prototype.subscribe = async (user,subscriber)=>{
        console.log(user,subscriber)
        let followers = await follow.findOne({
            where:  {
                [Op.and]:[
                    {idFollows:subscriber},
                    {idPerson:user}
                    ]
            }
        });
        if(followers){
            follow.create({idPerson:subscriber,idFollows:user,relationship:2});
            followers.increment('relationship', {by: 1});
        } else{
            follow.create({idPerson:subscriber,idFollows:user,relationship:1});
        }
    }
    follow.prototype.deleteFollow = async(user,)=>{

    }
    follow.prototype.getFriend = async(id) => {
        return await follow.findAll({
            attributes:["idFollows"],
            where: {
                [Op.and]: [
                    {idPerson:id},
                    {relationship:2}
                ]
            }
        })
    }
  return follow;
};
