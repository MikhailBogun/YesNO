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

    follow.prototype.subscribe = async (user,subscriber) => {
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
    };

    follow.prototype.deleteFollow = async(user,id)=>{
        const where = {
            [Op.and]: [
                {idFollows: id},
                {idPerson: user}
            ]
        };
        let subscriber = await follow.findOne(
            {
                where: {
                    [Op.and]: [
                        {idFollows: user},
                        {idPerson: id}
                    ]
                }
            }
        )
        console.log(subscriber.relationship)
        if(subscriber.relationship===2){
            await follow.decrement("relationship", {
                    by: 1,
                    where: where
                });

            return await follow.destroy({
                where:where
            });

        } else {
            return await follow.destroy({
                where:where
            });
        }
    };

    follow.prototype.getFriend = async(id) => {
        return await follow.findAll({
            attributes:["idFollows"],
            where: {
                [Op.and]: [
                    {idPerson:id},
                    {relationship:2}
                ]
            }
        });
    };

  return follow;
};
