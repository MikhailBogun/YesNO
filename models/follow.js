'use strict';
module.exports = (sequelize, DataTypes) => {
  const follow = sequelize.define('follow', {
    idPerson: DataTypes.INTEGER,
    idFollows: DataTypes.INTEGER,
      relationship:DataTypes.INTEGER

  }, {});
  follow.associate = function(models) {
    // associations can be defined here
      follow.belongsTo(models.User, {foreignKey:'idPerson'})
      follow.belongsTo(models.User, {foreignKey:'idFollows'})
  };
  return follow;
};
