'use strict';
module.exports = (sequelize, DataTypes) => {
  const post = sequelize.define('post', {
    name: DataTypes.STRING,
    message: DataTypes.STRING,
    image: DataTypes.STRING,
    yes: DataTypes.INTEGER,
    no: DataTypes.INTEGER,
    idUser: DataTypes.INTEGER,
    private: DataTypes.INTEGER
  }, {});
  post.associate = function(models) {
    // associations can be defined here
      post.hasMany(models.reaction, {foreignKey:"idPost"})// {foreignKey:"idPost"});//, {foreignKey: "id"});//, {foreignKey: 'idPost'});//, {foreignKey: 'id', targetKey:'idPost'})
      post.belongsTo(models.User, {foreignKey:"idUser"})
  };
  return post;
};
