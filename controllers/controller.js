const db = require("../models/index");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const nodemailer = require("nodemailer");
const config = require(__dirname + '/../config/config.json')
const fs = require('fs');
const Op = db.Sequelize.Op;
const secret = config.secret;



module.exports = {
    PostAll: async function(req, res){

        let decode = req.headers.idPerson;
        let allDataPosts = null;
        if(typeof req.query.text ==="undefined") {
             allDataPosts =await db.post.prototype.allDataPosts(decode,req.query.offset,0);

        } else {
            allDataPosts =await db.post.prototype.searchPost(req.query.text,req.query.offset,decode);

        }

        res.json({result:allDataPosts});
    },
    lengthRowsMyPosts: async function(req, res,next){
        let user = req.headers.idPerson;
        try {
            let dataPosts = await db.post.findAll({
                attributes:["id"],
                where:{
                    [Op.and]:[{
                        private:req.query.private
                    },{
                        idUser: user
                    }]
                }

            });
            res.json({length:dataPosts.length})
        } catch (e) {
            next(e)
        }
    },
    myPosts: async function(req, res,next){
        try{
            let dataPosts = await db.post.prototype.onePersonPosts(req.headers.idPerson,req.query.private,req.query.offset)
            res.json({result:dataPosts});
            //Todo:Избавиться от этого контролера все перенести в котроллер ниже
        } catch (e) {
            next(e)
        }
    },
    onePersonPosts:  async function(req, res,next){
        try {
            let {id, offset} = req.query;
            let result = await db.post.prototype.onePersonPosts(id,0,offset,req.headers.idPerson)
            res.json({result: result});
        } catch (e) {
            next(e)
        }
    },

    getLengthRows:async function(req, res){
        let searchText = req.query.text
        let user = req.headers.idPerson
        let data = null
        let {id, private}=req.query
        if(private==0) {
            if (req.query.id == "all") {
                if(typeof searchText==="undefined") {
                    data = await db.post.findAll({
                        attributes: ["id"],
                        where: {private: 0}
                    })
                } else{

                    data = await db.sequelize.query( `SELECT "post"."id"
                                         FROM "posts" AS "post"
                                         WHERE ("post"."private" = 0 AND "post"."name" ILIKE :search_name);`
                        ,{ replacements: { search_name: '%'+searchText+"%"  }, type: db.sequelize.QueryTypes.SELECT }
                    )
                }
            } else {
                data = await db.post.findAll({
                    attributes: ["id"],
                    where: {
                        [Op.and]: [{private: 0}, {idUser: req.query.id}]
                    },

                })
            }
        } else if(private==1) {
            if (req.query.id == "all") {
                data = await db.post.findAll({
                    attributes: ["id", "name", "message", "image", "yes", "no", "percent", "idUser"],
                    where: {private: 1},
                    order: [
                        ['id', 'DESC'],
                    ],
                    include: [{
                        model: db.User, include: [
                            {
                                model: db.follow,
                                attributes: [],
                                where: {
                                    [Op.and]: [
                                        {relationship: 2},
                                        {idFollows: user}
                                    ]
                                },
                                required: true
                            },
                        ],
                        attributes: ["login", "face"],
                        required: true
                    }]
                })
            } else{
                data = await db.post.findAll({
                    attributes: ["id"],
                    where: {
                        [Op.and]: [{private: 1}, {idUser: req.query.id}]
                    },
                });
            }
        }
        res.json({length:data.length})
    },
    showFriends: async function(req,res){
        let user = req.headers.idPerson;

        if(req.query.offset=="length") {
            let friends = await db.User.findAll({
                attributes: [ "id"],
                include: [{
                    model: db.follow,
                    attributes: [],
                    where: {
                        [Op.and]: [
                            {idFollows: user},
                            {relationship: 2}
                        ]
                    },
                }]
            })
            res.json({length:friends.length})
        } else {
            let friends = await db.User.findAll({
                attributes: ["login", "face", "id"],

                include: [{
                    model: db.follow,
                    attributes: [],
                    where: {
                        [Op.and]: [
                            {idFollows: user},
                            {relationship: 2}

                        ]
                    },
                }],
                offset: req.query.offset,
                limit: 5,
                subQuery: false
            })

            res.json({friends: friends})
        }
    },
    onlyFriends:async function(req, res){
        let {id,offset} = req.query
        let result=null
        let user = req.headers.idPerson

        if(id=="all") {
            result =await db.post.prototype.allDataPosts(user,req.query.offset,1);

        } else {
            result = await db.post.prototype.onePersonPosts(id,0,offset,req.headers.idPerson)
        }


        res.json({result:result});
    },
  addPost: async function(req, res, next){
        try {
            const decode = jwt.verify(req.body.id, secret)
            await db.post.create({
                name: req.body.hashteg,
                message: req.body.message,
                image: "/public/images/PostAll/" + req.files[0].filename,
                percent: 0,
                yes: 0,
                no: 0,
                idUser: decode.userid,
                private: req.body.private
            });
            res.send(200);
        } catch (e) {
            next(e)
        }
  },
  Authorization: async function(req, res,next){
        try {
            let {password, email} = req.body;

            let user = await db.User.prototype.oneUser(email)

            if(user){
              let hashPassword=bcrypt.hashSync(password,user.salt)
                if (user.password !== hashPassword) {
                    next("Вели неправильный пароль!")
                } else{
                    const token_authorization = jwt.sign({userid: user.id}, secret)
                    res.json({token: token_authorization});
                }
            } else{
                next("Пользователя несуществует!")
            }
        } catch(ex){
            next(ex)
        }

  },
  register_user: async function(req, res,next){
        try {

            let {login, password, email} = req.body;
            let user = await db.User.prototype.oneUser(email)
            if(!user){
                let salt = bcrypt.genSaltSync(10);
                let hash_password = bcrypt.hashSync(password, salt);
                let data = await db.User.prototype.createNewUser({
                    login: login,
                    password: hash_password,
                    salt: salt,
                    face: "assets/images/persons/inkognito.jpg",
                    email: email
                });
                const token_register = jwt.sign({userid: data.id}, secret);
                res.json({token: token_register})
            }else {
                next(1)
            }
        } catch (e) {
            next(e)
        }

  },
  getReaction: async function(req, res,next){
        try {
            await db.reaction.prototype.createNewReaction({
                idPerson: req.headers.idPerson,
                idPost: req.body.post.id,
                reaction: req.body.reaction,
                private: req.body.private
            });
            let percent = await db.post.prototype.incrementYesOrNo(req.body.post.id,req.body.reaction);
            res.json({percent: percent});
        } catch (e) {
            next(e)
        }
  },

  follows: async function (req, res){
        let user = req.headers.idPerson
        await db.follow.prototype.subscribe(user,req.body.follows)
      res.send(200)


  },
  removeFace: async function(req, res){

    let decode_follow = jwt.verify(req.body.id,secret);
    await db.User.update({face:"assets/images/persons/"+req.files[0].filename}, {
      where : {
        id: decode_follow.userid,
      }
    });

    res.send("assets/images/persons/"+req.files[0].filename);


  },
  removePassword: async function(req, res,next){
    let decode_follow = jwt.verify(req.body.id,secret)
    let data = await db.User.findAll({
      where : {
        id: decode_follow.userid
      }
    });
    for (let i = 0; i<data.length; i++) {
      let hash_password = require("crypto").createHash("sha256").update(req.body.password + data[i].dataValues.salt).digest("base64");
      if (hash_password == data[i].dataValues.password){
        let salt = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
        let hash = require("crypto").createHash("sha256").update(req.body.newPassword+salt).digest("base64");
        db.User.update({
          password:hash,
          salt: salt
        }, {
          where : {
            id: decode_follow.userid,
          }
        });
      } else  {
        next('Вели неправильный пароль!')

      }



    }


  },
    forgetPass: async function(req ,res,next){

        try {
            let email = req.body.email
            let code = String(Math.random().toString(9).substring(2, 8));
            let checkEmail = await db.User.prototype.updateCodeEmail(email,code)
            if(checkEmail[0]===1){
                let transporter = nodemailer.createTransport({
                    service: 'gmail',
                    auth: {
                        user: 'YesNoApp1@gmail.com',
                        pass: 'sendemail1'
                    }
                });
                let html = '<h3>'+ code +'</h3>'
                const mailOptions = {
                    from: 'YesNoApp1@gmail.com', //
                    to: req.body.email,
                    subject: 'Подтверждение изменения пароля в YesNo',
                    html: html//
                };
                transporter.sendMail(mailOptions, function (err, info) {
                    if(err)
                        console.log(err)
                    else
                        console.log(info);
                });
                res.send(200)
            } else{
                next('Пользователя несуществует!')

            }
        } catch (e) {
            next(e)
        }

    },
    newPassword: async function (req ,res,next){
        try{
            let {email, pass,code}=req.body;
            let salt = bcrypt.genSaltSync(10);
            let password = bcrypt.hashSync(pass, salt)
            let checkUpdatePass =await db.User.prototype.updatePassword(email,code,password,salt)
            if(checkUpdatePass[0]!==1){
                next("Неправильный Код")
            }
            res.sendStatus(200);
        } catch (e) {
            next(e)
        }
    },
  getFriends: async function (req ,res,next){
        try {
            let user = req.headers.idPerson;
            let friends = await db.User.findAll({
                attributes: ["login", "face", "id"],

                include: [{
                    model: db.follow,
                    attributes: [],
                    where: {
                        [Op.and]: [
                            {idFollows: user},
                            {relationship: 2}

                        ]
                    },
                }]
            })
            let followed = await db.User.findAll({
                attributes: ["login", "face", "id"],

                include: [{
                    model: db.follow,
                    attributes: [],
                    where: {
                        [Op.and]: [
                            {idFollows: user},
                            {relationship: 1}

                        ]
                    },
                }]
            })

            let subscriber = await db.User.findAll({
                attributes: ["login", "face", "id"],
                include: [{
                    model: db.follow,
                    as: 'check',
                    attributes: [],
                    where: {
                        [Op.and]: [
                            {idPerson: user},
                            {relationship: 1}

                        ]
                    }
                }]
            })


            res.json({followed: followed, subscriber: subscriber, friends: friends});
        } catch (e) {
           next(e)
        }
  },
    deletePost:async function(req,res,next){
        try {
            let post = await db.post.prototype.deletePost(req.params.id);

            if(post) {

                fs.unlinkSync(__dirname+"/.." + post.image);
                res.sendStatus(200)
            }
        } catch (e) {
            next(e)
        }
    },
    deleteFollow: async function(req,res, next) {
        try {
            var Op = db.Sequelize.Op
            var user = req.headers.idPerson;

            db.follow.findOne({
                where: {
                    [Op.and]: [
                        {idFollows: user},
                        {idPerson: req.params.id}
                    ]
                }
            }).then(followers => {
                if (followers.relationship == 2) {
                    db.follow.findOne({
                        where: {
                            [Op.and]: [
                                {idFollows: req.params.id},
                                {idPerson: user}
                            ]
                        }
                    }).then(friend => {
                        return friend.decrement('relationship', {by: 1});
                    })
                    return followers.destroy()
                } else {
                    return followers.destroy()
                }
            })
            res.send(200)

        } catch (e) {
            next(e)
        }
    }

}
