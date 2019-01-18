'use strict';
module.exports = (sequelize, DataTypes) => {
  const follow = sequelize.define('follow', {
    idPerson: DataTypes.INTEGER,
    idFollows: DataTypes.INTEGER,
      relationship:DataTypes.INTEGER

  }, {});
  follow.associate = function(models) {
    // associations can be defined here
      follow.belongsTo(models.User, {as:'TestOne',foreignKey:'idPerson'})
      follow.belongsTo(models.User, {as:'Test',foreignKey:'idFollows'})
  };
  return follow;
};
