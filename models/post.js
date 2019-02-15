'use strict';
module.exports = (sequelize, DataTypes) => {
    const post = sequelize.define('post', {
        name: DataTypes.TEXT,
        message: DataTypes.TEXT,
        image: DataTypes.TEXT,
        yes: DataTypes.INTEGER,
        no: DataTypes.INTEGER,
        percent: DataTypes.INTEGER,
        idUser: DataTypes.INTEGER,
        private: DataTypes.INTEGER,

    });
    const Op = sequelize.Sequelize.Op;

    post.associate = function (models) {
        // associations can be defined here
        post.hasMany(models.reaction, {foreignKey: "idPost"})// {foreignKey:"idPost"});//, {foreignKey: "id"});//, {foreignKey: 'idPost'});//, {foreignKey: 'id', targetKey:'idPost'})
        post.belongsTo(models.User, {foreignKey: "idUser"})
        post.belongsTo(models.User, {as: "test", foreignKey: "idUser"})
    };

    post.prototype.allDataPosts = async (user, offset, privatePost) => {

        const options = {
            attributes: ["id", "name", "message", "image", "yes", "no", "percent", "idUser"],
            where: {private: privatePost},
            order: [
                ['id', 'DESC'],
            ],
            include :[
                {
                    model: sequelize.models.reaction,
                    attributes: ["reaction"],
                    where: {idPerson: user},
                    required: false
                },
                {
                    model: sequelize.models.User,
                    include: [
                        {
                            model: sequelize.models.follow,
                            attributes: ["relationship","idFollows"],
                            where: {idFollows: user},
                            required: false
                        }
                    ],
                    attributes: ["id","login", "face"],
                }

            ],
            offset: offset,
            limit: 5,
            subQuery: false
        }
        if (privatePost===0){
            console.log(privatePost)
        } else{
            options.include = [{
                model: sequelize.models.reaction,
                attributes: ["reaction"],
                where: {idPerson: user},
                required: false
            },
                {
                    model: sequelize.models.User, include: [
                        {
                            model:sequelize.models.follow,
                            attributes:[],
                            where:{
                                [Op.and]: [
                                    {relationship:2},
                                    {idFollows:user}
                                ]
                            },
                            required: true
                        },
                    ],
                    attributes:["login","face"],
                    required: true
                }]
        }

        return await post.findAll(options);
    }

    post.prototype.searchPost = async (searchText,offset,user) =>{
        return await sequelize.query( `SELECT "post"."id",
                                                    "post"."name",
                                                     "post"."message", 
                                                     "post"."image", 
                                                     "post"."yes", 
                                                     "post"."no", 
                                                     "post"."percent", 
                                                     "post"."idUser",
                                                      "reactions"."id" AS "reactions_id",  
                                                      "User"."id" AS "User_id", 
                                                      "User"."login" AS "User_login", 
                                                      "User"."face" AS "User_face",
                                                      "User->follows"."id" AS "User_follows_id",
                                                       "User->follows"."relationship" AS "User_follows_relationship" 
                                            FROM "posts" AS "post"
                                                LEFT OUTER JOIN "reactions" AS "reactions" ON "post"."id" = "reactions"."idPost" AND "reactions"."idPerson"=:user 
                                                LEFT OUTER JOIN "Users" AS "User" ON "post"."idUser" = "User"."id" 
                                                LEFT OUTER JOIN "follows" AS "User->follows" ON "User"."id" = "User->follows"."idPerson" AND "User->follows"."idFollows"=:user 
                                                WHERE ("post"."private" = 0 AND "post"."name" ILIKE :search_name) 
                                            ORDER BY "post"."id" DESC 
                                            LIMIT :limit
                                            OFFSET :offset;`,
            { replacements: {   search_name: '%'+searchText+"%" ,
                    limit:5,
                    offset:offset ,
                    user:user},
                type: sequelize.QueryTypes.SELECT });
    }

    post.prototype.onePersonPosts = async (idUser,privatePost, offset, idPersonReaction=null)=>{
        const options = {
            attributes:["id","name","message","image","yes","no","percent"],
            order: [
                ['id', 'DESC'],
            ],
            where:{
                [Op.and]:[{
                    private:privatePost
                },{
                    idUser: idUser
                }]
            },
            offset: offset,
            limit: 5,
            subQuery: false
        }
        if (idPersonReaction){
            options.include = [{
                model: sequelize.models.reaction,
                attributes: ["reaction"],
                where: {idPerson: idPersonReaction},
                required: false
            }]
        }
        return await post.findAll(options);
    }

    post.prototype.incrementYesOrNo = async (idPost,reaction)=>{
        let onePost = await post.findById(idPost);
        if(reaction==0 && onePost.yes ==0){
            let percent =0
            onePost.increment('no', {by: 1});
            onePost.update({percent: percent});
            return await percent

        }else if(reaction==1){
            let percent = (onePost.yes + reaction) / ((onePost.no + onePost.yes + 1) / 100);
            onePost.increment('yes', {by: 1});
            onePost.update({percent: percent});
            return await percent

        }else if(reaction ==0){
            let percent = (onePost.yes) / ((onePost.no + 1 + onePost.yes) / 100);
            onePost.increment('no', {by: 1});
            onePost.update({percent: percent});
            return await percent
        }
    }
    post.prototype.deletePost =  async (idPost)=>{
        let dataPost = await post.findById(idPost)
        await post.destroy({
            where:
                {
                    id:idPost
                }})
        return dataPost
    }
    return post;
};
