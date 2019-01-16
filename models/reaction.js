'use strict';
module.exports = (sequelize, DataTypes) => {
  const reaction = sequelize.define('reaction', {
    idPerson: DataTypes.INTEGER,
    idPost: DataTypes.INTEGER,
    reaction: DataTypes.INTEGER
  }, {});
  reaction.associate = function(models) {
    // associations can be defined here
      reaction.belongsTo(models.post, {foreignKey:"idPost"});//, {foreignKey: "idPost", targetKey: "id"});//, {foreignKey: '');//,{ foreignKey: "idPost", targetKey:"id"})
  };
  return reaction;
};
