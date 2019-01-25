var db = require("../models/index");
var path = require("path");
var jwt = require('jsonwebtoken');
var bcrypt = require('bcrypt');

const config = require(__dirname + '/../config/config.json')

var now = new Date()
var Op = db.Sequelize.Op
var random= Math.random().toString(36).substring(2, 15)
const secret = config.secret



module.exports = {
    PostAll: async function(req, res){
       var decode = req.headers.idPerson

          let result = await db.post.findAll({
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

                 }]

          });


        res.json({result:result});
    },
    PrivateData: async function(req, res){
        let user = req.headers.idPerson

        let privateDateFriend =  await db.post.findAll({
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
        })

        res.json({post:privateDateFriend});
    },
    onePersonPosts:  async function(req, res){
        console.log("hello")
       let {id,offset} = req.query
        let result = await db.post.findAll({
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

        console.log("getLengthMyFriends")
        let user = req.headers.idPerson

    },
    getLengthRows:async function(req, res){

        console.log("Все сюда!")
        let user = req.headers.idPerson
        let data = null
        let {id, private}=req.query
        if(private==0) {
            if (req.query.id == "all") {
                data = await db.post.findAll({
                    attributes: ["id"],
                    where: {private: 0}
                })
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

                })
            }
        }
        res.json({length:data.length})
    },
    showFriends: async function(req,res){
        console.log("showFrends")
        let user = req.headers.idPerson
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
        console.log("onlyFriends")
        let {id,offset} = req.query
        console.log(id,offset)
        let result=null
        let user = req.headers.idPerson
        if(id=="all") {

            result =  await db.post.findAll({
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
                }],
                offset: offset,
                limit: 5,
                subQuery: false
            })
        } else {
            result = await db.post.findAll({
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
    addPrivatePost: async function(req, res){
        const decode = jwt.verify(req.body.id,secret)
        db.post.create({name:req.body.hashteg, message:req.body.message, image:"http://localhost:8000/public/images/PostAll/"+req.files[0].filename, yes:0,no:0,percent:0,idUser:decode.userid,private:1});
        res.send(200);
    },
  addPost: async function(req, res){
      console.log(req.files)
      const decode = jwt.verify(req.body.id,secret)
      db.post.create({name:req.body.hashteg, message:req.body.message, image:"http://localhost:8000/public/images/PostAll/"+req.files[0].filename,percent:0, yes:0,no:0,idUser:decode.userid,private:req.body.private});
      res.send(200);
  },
  Authorization: async function(req, res){
      let {login, password,email} = req.body
      db.User.findOne({
          where:{email:email}
      }).then(user=>{
          var hash_password = bcrypt.hashSync(password, user.salt)
          if(user.password==hash_password){
              const token_authorization = jwt.sign({userid: user.id},secret)
              res.json({token: token_authorization});
          }
      })

  },
  register_user: async function(req, res){
      var salt = bcrypt.genSaltSync(10);
        let {login, password,email} = req.body
      console.log(email)
      var hash_password = bcrypt.hashSync(password, salt)

    db.User.create({login:login, password: hash_password, salt:salt, face:"assets/images/persons/inkognito.jpg",email:email})
      .then(data => {
        const token_register = jwt.sign({userid: data.dataValues.id}, secret);
        res.json({token: token_register})
      })
  },
  allUsers: async function(req, res){
    let all_post_data = await db.User.findAll();

    res.send(all_post_data);
  },
  getReaction: async function(req, res){
    const decode = jwt.verify(req.body.id,secret)
      var that = this;

    db.reaction.create({idPerson:Number(decode.userid),idPost:req.body.post.id,reaction:req.body.reaction,private:req.body.private});
    if (req.body.reaction==1) {
        db.post.findById(req.body.post.id)
            .then(post => {
                that.percent=  (post.yes+1)/((post.no+post.yes+1)/100)

                return post.increment('yes', {by:1}), post.update({percent:that.percent});

            })
    } else  {
        db.post.findById(req.body.post.id)
            .then(post => {
                that.percent = 0
                if(post.yes!=0){
                     that.percent=  (post.yes+1)/((post.no+1+post.yes)/100)
                }
                return post.increment('no', {by:1}),post.update({percent:that.percent});

            })
    }
    // let post= await db.post.findById(req.body.post.id)
    //   let percent = (post.dataValues.yes)/((post.dataValues.no+post.dataValues.yes)/100)

    res.json({percent:that.percent });
  },
  myReactions: async function(req, res){


    let decode_follow = jwt.verify(req.body.id,secret)
    console.log(decode_follow.userid)
      console.log("________________________________________________")
    let data = await db.reaction.findAll({
      where : {
        idPerson: decode_follow.userid
      }
    });
    for( let i = 0; i<data.length; i++) {
        console.log("212122121221122")
      console.log(data[i].dataValues)
    }
    res.send(data);
  },
  follows: async function (req, res){
        var Op = db.Sequelize.Op
        let user = req.headers.idPerson
      console.log("cyda")
            //subscriber--relationship:1;friend--relationship:2
        db.follow.findOne({
            where:  { [Op.and]:[{idFollows:req.body.follows},{idPerson:user}]
        }}).then(followers=>{
            console.log(followers)
                if (followers !== null) {
                    db.follow.create({idPerson:req.body.follows,idFollows:user,relationship:2})
                    return followers.increment('relationship', {by: 1});

                } else {
                    db.follow.create({idPerson:req.body.follows,idFollows:user,relationship:1})
                }
         })



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
  removePassword: async function(req, res){
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
    test:async function(req,res){
        console.log(req.query)
        let result = await db.post.findAll({

            attributes:["id","name","message","image","yes","no","percent","idUser"],
            where:{private:0},
            order: [
                ['id','DESC'],
            ],

            include: [{
                model: db.reaction,
                attributes:["reaction"],
                where: {idPerson:1},
                required: false
            },
                {
                    model:db.User,
                    include:[
                        {
                            model: db.follow,
                            attributes:["relationship"],
                            where:{idFollows:1},
                            required: false
                        }
                    ],
                    attributes:["login","face"],

                }],
            offset:2,
            limit:2,
            subQuery:false


        });
        res.json({result:result})

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
