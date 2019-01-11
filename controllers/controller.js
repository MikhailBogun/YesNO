var db = require("../models/index");
var path = require("path");
const jwt = require('jsonwebtoken');

var now = new Date()
var random= Math.random().toString(36).substring(2, 15)
const secret = "secret"



module.exports = {
    PostAll: async function(req, res){
        console.log("Zzzzzzzzzzzz")
       var decode = jwt.verify(req.headers.id,secret).userid
        console.log(decode)
      let data = await db.PostAll.findAll({
          order: [
              ['id','DESC'],
          ]
      });
          let result = await db.PostAll.findAll({
              order: [
                  ['id','DESC'],
              ],
             include: [{
                 model: db.reaction,
                 attributes:["reaction"],
                 where: {idPerson:decode},
                 required: false
             }]

          });
        res.send(result);
    },
    PrivateData: async function(req, res){
        const Op = db.Sequelize.Op;
        var data = []
        let decode = jwt.verify(req.query.id,secret)

        let myFollow = await db.follows.findAll({
            where : {
                idPerson: String(decode.userid)
            }
        })


        for(let i=0;i<myFollow.length;i++){
            let bufer = await db.follows.findAll({
                where: {
                    idPerson: myFollow[i].dataValues.idFollows,
                    [Op.and]: {idFollows: myFollow[i].dataValues.idPerson}
                }
            }).then(res=>{
                data.push(res[0].dataValues.idPerson)
            })


        }
        var data_posts=[]
        for(let i = 0;i<data.length;i++){
            let bufer = await db.privatePosts.findAll({
                where: {
                    voted: data[i]
                }
            }).then(res=>{
                if(res.length!=0){
                    for (let j =0;j<res.length;j++)
                data_posts.push(res[j].dataValues)
                }}
            )
        }

        res.json({posts: data_posts, friend:data});
    },
    addPrivatePost: async function(req, res){

        const decode = jwt.verify(req.body.id,secret)
        db.privatePosts.create({name:req.body.hashteg, message:req.body.massage, image:"assets/images/PostAll/"+req.files[0].filename, yes:0,no:0,voted:String(decode.userid)});

        res.send(200);
    },
  addPost: async function(req, res){

      const decode = jwt.verify(req.body.id,secret)
      console.log(req.body)

      db.PostAll.create({Name:req.body.hashteg, massage:req.body.massage, image:"assets/images/PostAll/"+req.files[0].filename, yes:0,no:0,voted:String(decode.userid)});

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
    console.log(login,password)
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

    db.reaction.create({idPerson:Number(decode.userid),idPost:req.body.post.id,reaction:req.body.reaction});
    if (req.body.reaction==1) {
        db.PostAll.findById(req.body.post.id)
            .then(post => {


                return post.increment('yes', {by:1})

            })
    } else  {
        db.PostAll.findById(req.body.post.id)
            .then(post => {
                return post.increment('no', {by:1})

            })
    }
    let post= await db.PostAll.findById(req.body.post.id)
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

      let all_User_data = await db.User.findAll();
      let all_Follow_data = await db.follows.findAll()
      let error ='';
      console.log(req.body)
      let decode_follow = jwt.verify(req.body.id,secret)
      console.log(decode_follow)
      all_Follow_data.forEach(obj => {
        console.log(error)

          if (obj.dataValues.idPerson == String(req.body.person.id) && String(decode_follow.userid)==obj.dataValues.idFollows) {

           error = "err";
           console.log("err")

          }
        }
      )


    if(error=='') {
      all_User_data.forEach(obj => {
        if (decode_follow.userid == obj.dataValues.id) {
          db.follows.create({idPerson: String(req.body.person.id), idFollows: String(decode_follow.userid)})

          res.send("ok")

        }
      })
    }

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
    let friend_data=await db.follows.findAll({
      where: {
        idPerson: String(my_decoded.userid)
      }
    })
    let myFollow=await db.follows.findAll({
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

  }

}
