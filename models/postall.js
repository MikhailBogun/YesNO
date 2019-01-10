'use strict';
module.exports = (sequelize, DataTypes) => {
  const PostAll = sequelize.define('PostAll', {
    Name: DataTypes.STRING,
    massage: DataTypes.STRING,
    image: DataTypes.STRING,
    yes: DataTypes.INTEGER,
    no: DataTypes.INTEGER,
    voted: DataTypes.STRING
  }, {});
  PostAll.associate = function(models) {
    // associations can be defined here
      PostAll.hasMany(models.reaction, {foreignKey:"idPost"})// {foreignKey:"idPost"});//, {foreignKey: "id"});//, {foreignKey: 'idPost'});//, {foreignKey: 'id', targetKey:'idPost'})

  };
  return PostAll;
};
