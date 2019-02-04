var db = require("../models/index"); // TODO Используй es6 const / let
var path = require("path"); // TODO Используй es6 const / let //TODO убрать неиспользуемый модуль
var jwt = require('jsonwebtoken'); // TODO Используй es6 const / let
var bcrypt = require('bcrypt'); // TODO Используй es6 const / let
var nodemailer = require("nodemailer"); // TODO Используй es6 const / let
const config = require(__dirname + '/../config/config.json') // TODO пропустил ";"
var fs = require('fs'); // TODO Используй es6 const / let
var filePath = "/Users/sooprit/project/yesno" // TODO Используй es6 const / let // TODO пропустил ";" // TODO что это за путь
var now = new Date() // TODO Используй es6 const / let //TODO убрать неиспользуемую переменную
var Op = db.Sequelize.Op // TODO Используй es6 const / let
var random= Math.random().toString(36).substring(2, 15) // TODO Используй es6 const / let // TODO пропустил ";"
const secret = config.secret // TODO пропустил ";"



module.exports = {
    PostAll: async function(req, res){
        var decode = req.headers.idPerson // TODO пропустил ";" // TODO Используй es6 const / let
        var allDataPosts = null; // TODO Используй es6 const / let
// TODO Убрать пустую строку

        if(typeof req.query.text ==="undefined") // TODO перенеси { суда
        {
// TODO Убрать пустую строку

            allDataPosts = await db.post.findAll({ // TODO Вынеси в модель метод
                attributes:["id","name","message","image","yes","no","percent","idUser"],
                where:{private:0},
                order: [
                    ['id','DESC'],
                ],
                include: [{
                    model: db.reaction,
                    attributes:["reaction"],
                    where: {idPerson:decode},
                    required: false
                },
                    {
                        model:db.User,
                        include:[
                            {
                                model: db.follow,
                                attributes:["relationship"],
                                where:{idFollows:decode},
                                required: false
                            }
                        ],
                        attributes:["login","face"],

                    }],
                offset: req.query.offset,
                limit: 5,
                subQuery: false

            });
        } else {
            // TODO Вынеси в модель метод
            allDataPosts= await db.sequelize.query( `SELECT "post"."id", 
                                                    "post"."name",
                                                     "post"."message", 
                                                     "post"."image", 
                                                     "post"."yes", 
                                                     "post"."no", 
                                                     "post"."percent", 
                                                     "post"."idUser",
                                                      "reactions"."id" AS "reactions.id", 
                                                      "reactions"."reaction" AS "reactions.reaction", 
                                                      "User"."id" AS "User.id", 
                                                      "User"."login" AS "User.login", 
                                                      "User"."face" AS "User.face",
                                                      "User->follows"."id" AS "User.follows.id",
                                                       "User->follows"."relationship" AS "User.follows.relationship" 
                                            FROM "posts" AS "post"
                                                LEFT OUTER JOIN "reactions" AS "reactions" ON "post"."id" = "reactions"."idPost" AND "reactions"."idPerson"=:user 
                                                LEFT OUTER JOIN "Users" AS "User" ON "post"."idUser" = "User"."id" 
                                                LEFT OUTER JOIN "follows" AS "User->follows" ON "User"."id" = "User->follows"."idPerson" AND "User->follows"."idFollows"=:user 
                                                WHERE ("post"."private" = 0 AND "post"."name" ILIKE :search_name) 
                                            ORDER BY "post"."id" DESC 
                                            LIMIT :limit
                                            OFFSET :offset;`,



                { replacements: { search_name: '%'+req.query.text+"%" ,limit:5,offset:req.query.offset ,user:decode}, type: db.sequelize.QueryTypes.SELECT }
            )
            console.log("tyt") // TODO Что это и зачем оно тут?
            allDataPostss = await db.post.findAll({ // TODO Что это и зачем оно тут?
                attributes:["id","name","message","image","yes","no","percent","idUser"],
                where:{
                    [Op.and]:[
                        {private:0},
                         {name:{[Op.iLike]:"%"+req.query.text}}
                    ]},
                order: [
                    ['id','DESC'],
                ],
                include: [{
                    model: db.reaction,
                    attributes:["reaction"],
                    where: {idPerson:decode},
                    required: false
                },
                    {
                        model:db.User,
                        include:[
                            {
                                model: db.follow,
                                attributes:["relationship"],
                                where:{idFollows:decode},
                                required: false
                            }
                        ],
                        attributes:["login","face"],

                    }],
                offset: req.query.offset,
                limit: 5,
                subQuery: false

            });
        }



        console.log("y nas norm") // TODO Что это и зачем оно тут?
        res.json({result:allDataPosts});
    },
    PrivateData: async function(req, res){
        let user = req.headers.idPerson // TODO пропустил ";"

        let privateDateFriend =  await db.post.findAll({ // TODO Вынеси в модель метод
            attributes:["id","name","message","image","yes","no","percent","idUser"],
            where:{private:1},
            order: [
                ['id','DESC'],
            ],
            include:[{
                model:db.User, include: [
                    {
                        model:db.follow,
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
        }) // TODO пропустил ";"

        res.json({post:privateDateFriend});
    },
    lengthRowsMyPosts: async function(req, res,next){
        let user = req.headers.idPerson // TODO пропустил ";"
        try {
            let dataPosts = await db.post.findAll({ // TODO Вынеси в модель метод
                attributes:["id"],
                where:{
                    [Op.and]:[{
                        private:req.query.private
                    },{
                        idUser: user
                    }]
                }

            }) // TODO пропустил ";"
            res.json({length:dataPosts.length})
        } catch (e) {
            console.log("neeeeee") // TODO убей это
            next(e)
        }
    },
    myPosts: async function(req, res,next){
        console.log("hello") // TODO убей это
        try{
            let user = req.headers.idPerson // TODO пропустил ";"

            let dataPosts = await db.post.findAll({ // TODO Вынеси в модель метод
                attributes:["id","name","message","image","yes","no","percent"],
                where:{
                    [Op.and]:[{
                        private:req.query.private
                    },{
                        idUser: user
                    }]
                }

            }) // TODO пропустил ";"
            console.log("juv") // TODO убей это
            res.json({result:dataPosts})
        } catch (e) {
            next(e)
        }
    },
    onePersonPosts:  async function(req, res){
        console.log("hello") // TODO убей это
       let {id,offset} = req.query // TODO пропустил ";"
        let result = await db.post.findAll({ // TODO Вынеси в модель метод
            attributes:["id","name","message","image","yes","no","percent"],
            where:{
                [Op.and]:[{private:0},{idUser:id}]
                },
            order: [
                ['id','DESC'],
            ],
            include: [{
                model: db.reaction,
                attributes:["reaction"],
                where: {idPerson:req.headers.idPerson},
                required: false
            }],
            offset:offset,
            limit:5,
            subQuery:false

        });


        res.json({result:result});
    },
    getLengthMyFriends:async function(req, res){

        console.log("getLengthMyFriends") // TODO убей это
        let user = req.headers.idPerson // TODO что это?

    },
    getLengthRows:async function(req, res){
        var searchText = req.query.text // TODO пропустил ";" и const / let
        let user = req.headers.idPerson // TODO пропустил ";"
        let data = null // TODO пропустил ";"
        let {id, private}=req.query // TODO пропустил ";"

        if(private==0) { // TODO используй === вместо ==
            if (req.query.id == "all") {
                if(typeof searchText==="undefined") {
                    data = await db.post.findAll({
                        attributes: ["id"],
                        where: {private: 0}
                    })
                } else{
                    // TODO Вынеси в модель метод
                    data = await db.sequelize.query( `SELECT "post"."id"
                                         FROM "posts" AS "post"
                                         WHERE ("post"."private" = 0 AND "post"."name" ILIKE :search_name);`
                        ,{ replacements: { search_name: '%'+searchText+"%"  }, type: db.sequelize.QueryTypes.SELECT }
                    )
                }
            } else {
                data = await db.post.findAll({ // TODO Вынеси в модель метод
                    attributes: ["id"],
                    where: {
                        [Op.and]: [{private: 0}, {idUser: req.query.id}]
                    },

                })
            }
        } else if(private==1) {
            if (req.query.id == "all") { // TODO используй === вместо ==
                data = await db.post.findAll({ // TODO Вынеси в модель метод
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
                data = await db.post.findAll({ // TODO Вынеси в модель метод
                    attributes: ["id"],
                    where: {
                        [Op.and]: [{private: 1}, {idUser: req.query.id}]
                    },

                })
            }
        }
        //console.log(data)
        res.json({length:data.length})
    },
    showFriends: async function(req,res){
        console.log("showFrends") // TODO пропустил ";"
        let user = req.headers.idPerson // TODO пропустил ";"
        if(req.query.offset=="length") { // TODO интересный подход, роскажешь потом) // TODO используй === вместо ==
            let friends = await db.User.findAll({ // TODO Вынеси в модель метод
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
            }) // TODO пропустил ";"
            res.json({length:friends.length})
        } else {
            let friends = await db.User.findAll({ // TODO Вынеси в модель метод
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
            }) // TODO пропустил ";"
            res.json({friends: friends})
        }
    },
    onlyFriends:async function(req, res){
        console.log("onlyFriends") // TODO пропустил ";"
        let {id,offset} = req.query // TODO пропустил ";"
        console.log(id,offset) // TODO пропустил ";"
        let result=null // TODO пропустил ";"
        let user = req.headers.idPerson // TODO пропустил ";"
        if(id=="all") { // TODO используй === вместо ==

            result =  await db.post.findAll({ // TODO Вынеси в модель метод
                attributes:["id","name","message","image","yes","no","percent","idUser"],
                where:{private:1},
                order: [
                    ['id','DESC'],
                ],
                include:[{
                    model: db.reaction,
                    attributes: ["reaction"],
                    where: {idPerson: req.headers.idPerson},
                    required: false
                        },
                        {
                    model:db.User, include: [
                        {
                            model:db.follow,
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
                }],
                offset: offset,
                limit: 5,
                subQuery: false
            })
        } else {
            result = await db.post.findAll({ // TODO Вынеси в модель метод
                attributes: ["id", "name", "message", "image", "yes", "no", "percent"],
                where: {
                    [Op.and]: [{private: 1}, {idUser: id}]
                },
                order: [
                    ['id', 'DESC'],
                ],
                include: [{
                    model: db.reaction,
                    attributes: ["reaction"],
                    where: {idPerson: req.headers.idPerson},
                    required: false
                }],
                offset: offset,
                limit: 5,
                subQuery: false

            });
        }


        res.json({result:result});
    },
  addPost: async function(req, res){
      console.log(req.files) // TODO убить // TODO пропустил ";"
      const decode = jwt.verify(req.body.id,secret) // TODO пропустил ";"
      // TODO структурируй эту дикую строку использую async / await у тебя ответ уходит раньше чем запрос к базе
      db.post.create({name:req.body.hashteg, message:req.body.message, image:"/public/images/PostAll/"+req.files[0].filename,percent:0, yes:0,no:0,idUser:decode.userid,private:req.body.private});
      res.send(200);
  },
  Authorization: async function(req, res,next){
        try {
            let {password, email} = req.body // TODO пропустил ";"
            db.User.findOne({ // TODO async / await юзай
                where: {email: email}
            }).then(user => {
                //TODO можна написать так if (!user) {
                if (user==null){
                    next("Пользователя несуществует!")
                }
                else {
                    var hash_password = bcrypt.hashSync(password, user.salt) // TODO пропустил ";" и const / let
                    console.log("tyt2/0") // TODO убить
                    if (user.password == hash_password) { // TODO используй ===

                    } else {

                    }
                    // можна избавиться от вложености наисав вот так
                    /*
                    if (user.password !== hash_password) {
                        next("Вели неправильный пароль!")
                    }

                    const token_authorization = jwt.sign({userid: user.id}, secret);
                    return res.json({token: token_authorization});
                    */

                }
            })

        } catch(ex){
            console.log("!!!!!!") // TODO убить
            next(ex)
        }

  },
  register_user: async function(req, res,next){
      var salt = bcrypt.genSaltSync(10);
        let {login, password,email} = req.body // TODO пропустил ";"
      console.log(email)// TODO убить
      var hash_password = bcrypt.hashSync(password, salt) // TODO пропустил ";"
    db.User.findOne({where:{email:email}}) // TODO await структурируй where и вынеси этот метод в модель
        .then(data=>{
            if(data !==null){
                next(1)
            } else{
                // TODO await и вынеси этот метод в модель
                db.User.create({login:login, password: hash_password, salt:salt, face:"assets/images/persons/inkognito.jpg",email:email})
                    .then(data => {
                        const token_register = jwt.sign({userid: data.dataValues.id}, secret);
                        res.json({token: token_register})
                    })
            }
        })

  },
  allUsers: async function(req, res){ // TODO Эталонная твоя апиха где все ок =)
    let all_post_data = await db.User.findAll();

    res.send(all_post_data);
  },
  getReaction: async function(req, res){
    const decode = jwt.verify(req.body.id,secret) // TODO пропустил ";"
      var that = this;
    // TODO await
    db.reaction.create({idPerson:Number(decode.userid),idPost:req.body.post.id,reaction:req.body.reaction,private:req.body.private});
    if (req.body.reaction==1) {
        db.post.findById(req.body.post.id)  // TODO await
            .then(post => {
                that.percent=  (post.yes+1)/((post.no+post.yes+1)/100) // TODO пропустил ";"
                res.json({percent:that.percent});
                return post.increment('yes', {by:1}), post.update({percent:that.percent});// TODO что это?

            })
    } else  {
        db.post.findById(req.body.post.id) // TODO await
            .then(post => {
                that.percent = 0
                if(post.yes!=0){ // TODO ===
                     that.percent=  (post.yes)/((post.no+1+post.yes)/100)
                }
                res.json({percent:that.percent });
                return post.increment('no', {by:1}),post.update({percent:that.percent}); // TODO что это?

            })
    }
    // let post= await db.post.findById(req.body.post.id) // TODO убить
    //   let percent = (post.dataValues.yes)/((post.dataValues.no+post.dataValues.yes)/100) // TODO убить

  },

  follows: async function (req, res){
        var Op = db.Sequelize.Op // TODO пропустил ";"
        let user = req.headers.idPerson // TODO пропустил ";"

            //subscriber--relationship:1;friend--relationship:2 // TODO убить
        db.follow.findOne({ // TODO await
            where:  { [Op.and]:[{idFollows:req.body.follows},{idPerson:user}]
        }}).then(followers=>{
                if (followers !== null) {
                    db.follow.create({idPerson:req.body.follows,idFollows:user,relationship:2}) // TODO пропустил ";" и await
                    return followers.increment('relationship', {by: 1});

                } else {
                    db.follow.create({idPerson:req.body.follows,idFollows:user,relationship:1})// TODO пропустил ";" и await
                }
         })// TODO пропустил ";"
      res.send(200)


  },
  removeFace: async function(req, res){

    let decode_follow = jwt.verify(req.body.id,secret)
      console.log("huilo")

      console.log(req.files)

    db.User.update({face:"assets/images/persons/"+req.files[0].filename}, {
      where : {
        id: decode_follow.userid,
      }
    });
    res.send("assets/images/persons/"+req.files[0].filename)


  },
  removePassword: async function(req, res,next){
    let decode_follow = jwt.verify(req.body.id,secret)
    console.log(decode_follow.userid)
    let data = await db.User.findAll({
      where : {
        id: decode_follow.userid
      }
    });
    for (let i = 0; i<data.length; i++) {
      console.log(data[i].dataValues.id)
      let hash_password = require("crypto").createHash("sha256").update(req.body.password + data[i].dataValues.salt).digest("base64");
      if (hash_password == data[i].dataValues.password){
        let salt = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
        console.log("zdesssss")
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
        console.log("ERRorr Update")

      }



    }


  },
    forgetPass: async function(req ,res,next){

        try {
            var email = req.body.emailGetCode
            db.User.findOne({
                where:{
                email:req.body.email
                }}).then(user=>{
                    if(user===null){
                        next('Пользователя несуществует!')
                    } else{
                        var transporter = nodemailer.createTransport({
                            service: 'gmail',
                            auth: {
                                user: 'YesNoApp1@gmail.com',
                                pass: 'sendemail1'
                            }
                        });
                        let code = String(Math.random().toString(9).substring(2, 8));
                        let html = '<h3>'+ code +'</h3>'
                        const mailOptions = {
                            from: 'YesNoApp1@gmail.com', //
                            to: req.body.email,
                            subject: 'Подтверждение входа в YesNo',
                            html: html//
                        };
                        transporter.sendMail(mailOptions, function (err, info) {
                            if(err)
                                console.log(err)
                            else
                                console.log(info);
                        });
                        res.send(200)
                        return user.update({codeEmail:Number(code)})
                    }
            })
        } catch (e) {
            next(e)
        }

    },
    newPassword: async function (req ,res,next){
        try{
            console.log("Pobeda")
            console.log(req.body)
            let {email, pass,code}=req.body
            db.User.findOne({
                where:{
                    [Op.and]:[
                        {email:email},
                        {codeEmail:code}
                    ]
                }
            }).then(user=>{
                if(user===null){
                        console.log("Неправильный код")
                        next("Неправильный Код")

                } else {
                    console.log("Все хуйня меняем")
                    var salt = bcrypt.genSaltSync(10);
                    var password = bcrypt.hashSync(pass, salt)

                    user.update({password:password,salt:salt,codeEmail:null})
                }
            })
        } catch (e) {
            next(e)
        }
    },
  getFriends: async function (req ,res){
      console.log("Hello1")
      let user = req.headers.idPerson
      let friends = await db.User.findAll({
          attributes:["login","face","id"],

          include:[{
              model: db.follow,
              attributes:[],
              where:{
                  [Op.and]: [
                      {idFollows:user},
                      {relationship:2}

                  ]
              },
          }]
      })
      let followed = await db.User.findAll({
          attributes:["login","face","id"],

          include:[{
              model: db.follow,
              attributes:[],
              where:{
                  [Op.and]: [
                      {idFollows:user},
                      {relationship:1}

                  ]
              },
          }]
      })

      let subscriber = await db.User.findAll({
          attributes:["login","face","id"],
          include:[{
              model: db.follow,
              as:'check',
              attributes:[],
              where:{
                  [Op.and]: [
                      {idPerson:user},
                      {relationship:1}

                  ]
              }
          }]
      })



    res.json({followed:followed,subscriber:subscriber,friends:friends})

  },
    deletePost:async function(req,res,next){
        try {
            console.log(req.params.id)
            db.post.findById(req.params.id).then(post=>{
                fs.unlinkSync(filePath+post.image);
            })
        } catch (e) {
            next(e)
        }
    },
    deleteFollow: async function(req,res){
        var Op = db.Sequelize.Op
        var user =req.headers.idPerson;

        db.follow.findOne({
            where: {
                [Op.and]: [
                    {idFollows:user},
                    {idPerson:req.params.id}
                ]
            }
        }).then(followers =>{
            if(followers.relationship ==2){
                db.follow.findOne({where:{
                        [Op.and]: [
                            {idFollows:req.params.id},
                            {idPerson:user}
                        ]
                }}).then(friend=>{
                    return friend.decrement('relationship', {by: 1});
                })
                return followers.destroy()
            } else {
                return followers.destroy()
            }
        })

    }

}
