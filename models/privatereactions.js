'use strict';
module.exports = (sequelize, DataTypes) => {
  const privateReactions = sequelize.define('privateReactions', {
    idPerson: DataTypes.INTEGER,
    idPost: DataTypes.INTEGER,
    reaction: DataTypes.INTEGER
  }, {});
  privateReactions.associate = function(models) {
    // associations can be defined here
  };
  return privateReactions;
};