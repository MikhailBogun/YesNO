'use strict';
module.exports = (sequelize, DataTypes) => {
  const friends = sequelize.define('friends', {
    idFriendOne: DataTypes.INTEGER,
    idFriendTwo: DataTypes.INTEGER
  }, {});
  friends.associate = function(models) {
    // associations can be defined here
      friends.belongsTo(models.User, {foreignKey:"idFriendOne"})
      friends.belongsTo(models.User, {foreignKey:"idFriendTwo"})

  };
  return friends;
};
