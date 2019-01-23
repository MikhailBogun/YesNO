var db = require("../models/index");
var path = require("path");
var jwt = require('jsonwebtoken');

const config = require(__dirname + '/../config/config.json')

var now = new Date()
var Op = db.Sequelize.Op
var random= Math.random().toString(36).substring(2, 15)
const secret = config.secret



module.exports = {
    jwt: jwt,
    secret:secret,
    db:db,
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
        console.log(req.params.id)
        let result = await db.post.findAll({
            attributes:["id","name","message","image","yes","no","percent"],
            where:{
                [Op.and]:[{private:0},{idUser:req.params.id}]
                },
            order: [
                ['id','DESC'],
            ],
            include: [{
                model: db.reaction,
                attributes:["reaction"],
                where: {idPerson:req.headers.idPerson},
                required: false
            }]

        });


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
      db.post.create({name:req.body.hashteg, message:req.body.message, image:"http://localhost:8000/public/images/PostAll/"+req.files[0].filename, yes:0,no:0,idUser:decode.userid,private:0});
      res.send(200);
  },
  Authorization: async function(req, res){
      let {login, password} = req.body
      let all_users_data = await db.User.findAll();
      all_users_data.forEach(obj => {
        if (obj.dataValues.login == login) {
          let hash_password = require("crypto").createHash("sha256").update(password + obj.dataValues.salt).digest("base64");
          if (obj.dataValues.password == hash_password){
            const token_authorization = jwt.sign({userid: obj.dataValues.id},secret)
            res.json({token: token_authorization});
          }
        }
      });
  },
  register_user: async function(req, res){
        let {login, password} = req.body
    let salt = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    let hash_password = require("crypto").createHash("sha256").update(password + salt).digest("base64");

    db.User.create({login:login, password: hash_password, salt:salt, face:"assets/images/persons/inkognito.jpg"})
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

    db.reaction.create({idPerson:Number(decode.userid),idPost:req.body.post.id,reaction:req.body.reaction,private:req.body.private});
    if (req.body.reaction==1) {
        db.post.findById(req.body.post.id)
            .then(post => {


                return post.increment('yes', {by:1})

            })
    } else  {
        db.post.findById(req.body.post.id)
            .then(post => {

                return post.increment('no', {by:1})

            })
    }
    console.log("zdes")
      var that = this;
      db.post.findById(req.body.post.id)
          .then(post=>{
              console.log("ne")
              that.percent = (post.yes)/((post.no+post.yes)/100)
              console.log(percent)
              return post.update({percent:that.percent})
          })
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

    },
    deleteFollow: async function(req,res){
        var Op = db.Sequelize.Op
        var user =req.headers.idPerson;
        // db.follow.findOne(
        //     {where:
        //             {[Op.or]:
        //                     [
        //                         {[Op.and]:
        //                                 [
        //                                     {relationship:1},
        //                                     {idFollows:user},
        //                                     {idPerson:req.params.id}
        //                                     ]},
        //                         {[Op.and]:
        //                                 [
        //                                     {relationship:1},
        //                                     {idFollows:req.params.id},
        //                                     {idPerson:user}
        //                                     ]}
        //                         ]
        //             }
        //     }
        //     )
        //     .then(followers=>{
        //         console.log(followers)
        //         if (followers.relationship == 2){
        //             return followers.decrement('relationship', {by: 1});
        //         } else {
        //             return followers.destroy()
        //         }
        //         //db.follow.create({idFollows:req.params.id,idPerson:user})
        //
        //
        //         })

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
