'use strict';
module.exports = (sequelize, DataTypes) => {
  const closedReaction = sequelize.define('closedReaction', {
    idPerson: DataTypes.INTEGER,
    idPost: DataTypes.INTEGER,
    reaction: DataTypes.INTEGER
  }, {});
  closedReaction.associate = function(models) {
    // associations can be defined here
  };
  return closedReaction;
};