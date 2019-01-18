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
              attributes:["id","name","message","image","yes","no","percent"],
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
                         },
                         {
            model: db.follow,
            as:'check',
            attributes:["relationship"],
            where:{
                [Op.and]:[
                    {relationship:2},
                    {idPerson:decode}
                ],
            },
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
        var Op = db.Sequelize.Op
        // let test = await db.User.findAll({
        //     attributes:["login","face"],
        //     include:[{
        //         model:db.follow,
        //         attributes:["idFollows"],
        //         where:{idPerson:user}
        //     },
        //         {
        //             model:db.closedPost,
        //             required: true
        //         }
        //     ],
        //      order: [[{ model: db.closedPost},"id","DESC"]]
        // })
        let privateDateFriend =  await db.post.findAll({
            where:{private:1},
            order: [
                ['id','DESC'],
            ],
            include:[{
                model:db.User, include: [
                    {
                        model:db.follow,
                        attributes:["idFollows"],
                        where:{idPerson:user}
                    }
                ],
                attributes:["login","face"],
                required: true
            }]
        })
        let privateDate =  await db.post.findAll({
            where:{private:1},
            order: [
                ['id','DESC'],
            ],
            include:[{
                model:db.User, include: [
                    {
                        model:db.friends,
                        attributes:["idFriendTwo"],
                        where:{idFriendOne:user}//[Op.or]:[{idFriendTwo:user},{idFriendOne:user}]}
                    }
                ],
                attributes:["login","face"],
                required: true
            }]
        })
        res.json({post:privateDateFriend});
    },
    addPrivatePost: async function(req, res){
        const decode = jwt.verify(req.body.id,secret)
        db.post.create({name:req.body.hashteg, message:req.body.massage, image:"http://localhost:8000/public/images/PostAll/"+req.files[0].filename, yes:0,no:0,percent:0,idUser:decode.userid,private:1});
        res.send(200);
    },
  addPost: async function(req, res){

      const decode = jwt.verify(req.body.id,secret)
      db.post.create({name:req.body.hashteg, message:req.body.message, image:"http://localhost:8000/public/images/PostAll/"+req.files[0].filename, yes:0,no:0,idUser:decode.userid,private:0});
      res.send(200);
  },
  Authorization: async function(req, res){
      let login = req.body.login;
      let password = req.body.password;
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

    let login = req.body.login;
    let password = req.body.password;
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
    let post= await db.post.findById(req.body.post.id)
      let percent = (post.dataValues.yes)/((post.dataValues.no+post.dataValues.yes)/100)

    res.json({percent:percent });
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
                    return followers.increment('relationship', {by: 1});
                } else {
                    db.follow.create({idPerson:req.body.follows,idFollows:user,relationship:1})
                }
         })



  },
  removeFace: async function(req, res){

    let decode_follow = jwt.verify(req.body.id,secret)

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
      let my_decoded = jwt.verify(req.body.id,secret);
      let data =[[],[],[]]
        console.log("Hello2")
    let friend_data=await db.follow.findAll({
      where: {
        idPerson: String(my_decoded.userid)
      }
    })
    let myFollow=await db.follow.findAll({
      where: {
        idFollows: String(my_decoded.userid)
      }
    })
    let user=await db.User.findAll();
    friend_data.forEach(obj =>{
      user.forEach(u=>{
        if(String(u.dataValues.id)==obj.dataValues.idFollows){
          data[0].push({
            login: u.dataValues.login,
            face: u.dataValues.face,
            id: jwt.sign({userId: u.dataValues.id}, String(u.dataValues.createdAt))
          })
        }
      })
    })
    myFollow.forEach(obj =>{
      user.forEach(u=>{
        if(String(u.dataValues.id)==obj.dataValues.idPerson){
          data[1].push({
            login: u.dataValues.login,
            face: u.dataValues.face,
            id: jwt.sign({userId: u.dataValues.id}, String(u.dataValues.createdAt))
          })
        }
      })
    })
    //console.log(data)
    data[0].forEach(obj =>
    {
      data[1].forEach(d =>
      {

        if(obj!=null && d!=null && obj.login==d.login){

          data[2].push(obj)
          console.log(data[0].indexOf(obj))

        }
      })
    })

    res.send(data)

  },
    deleteFollow: async function(req,res){
        var Op = db.Sequelize.Op
        var user =req.headers.idPerson;
        db.follow.findOne(
            {where:
                    {[Op.or]:
                            [
                                {[Op.and]:
                                        [
                                            {idFollows:user},
                                            {idPerson:req.params.id}
                                            ]},
                                {[Op.and]:
                                        [
                                            {idFollows:req.params.id},
                                            {idPerson:user}
                                            ]
                                }
                                ]
                    }
            }
            )
            .then(followers=>{
                console.log(followers)
                if (followers.relationship == 2){
                    return followers.decrement('relationship', {by: 1});
                } else {
                    return followers.destroy()
                }
                //db.follow.create({idFollows:req.params.id,idPerson:user})


                })

    }

}
