'use strict';
module.exports = (sequelize, DataTypes) => {
  const reaction = sequelize.define('reaction', {
    idPerson: DataTypes.INTEGER,
    idPost: DataTypes.INTEGER,
    reaction: DataTypes.INTEGER,
    private: DataTypes.INTEGER
  }, {});
  reaction.associate = function(models) {
      reaction.belongsTo(models.post, {foreignKey:"idPost"});// associations can be defined here
  };
  reaction.prototype.createNewReaction = async (data)=>{
    return await reaction.create(data);
  }
  return reaction;
};
