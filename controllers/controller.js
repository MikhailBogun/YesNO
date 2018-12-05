var db = require("../models/index");
var path = require("path");
const jwt = require('jsonwebtoken');
const secret ="siski";


module.exports = {
    PostAll: async function(req, res){
      books =[
        {
          name:'World!',
        }
      ];
      let all_post_data = await db.PostAll.findAll();

      res.send(all_post_data);
    },
  addPost: async function(req, res){
      console.log("addpost");
      console.log(req.body);
      console.log(req.body.massage);
      console.log(req.files[0]);
      console.log(req.files[0].filename)

      const decode = jwt.verify(req.body.id,secret)
      console.log("liveeeeeee")
      console.log(req.body.id)
    console.log(decode.userid)
      db.PostAll.create({Name:req.body.hashteg, massage:req.body.massage, image:"assets/images/PostAll/"+req.files[0].filename, yes:0,no:0,voted:String(decode.userid)});

      res.send(200);
  },
  Authorization: async function(req, res){
      console.log(req.body.login);
      console.log(req.body.password);
      let login = req.body.login;
      let password = req.body.password;
      let all_users_data = await db.User.findAll();
      all_users_data.forEach(obj => {
        console.log(obj.dataValues.login)
        if (obj.dataValues.login == login) {
          let hash_password = require("crypto").createHash("sha256").update(password + obj.dataValues.salt).digest("base64");
          if (obj.dataValues.password == hash_password){
            console.log("pobeda");
            const token_authorization = jwt.sign({userid: obj.dataValues.id},secret)
            res.json({token: token_authorization});
          }
        }
      });
  },
  register_user: async function(req, res){
      console.log("Password!");

    let login = req.body.login;
    let password = req.body.password;
    console.log(login,password)
    let salt = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    let hash_password = require("crypto").createHash("sha256").update(password + salt).digest("base64");

    db.User.create({login:login, password: hash_password, salt:salt, face:"assets/images/persons/inkognito.jpg"})
      .then(data => {
        const token_register = jwt.sign({userId: data.dataValues.id}, secret);
        res.json({token: token_register})
      })
  },
  allUsers: async function(req, res){
    let all_post_data = await db.User.findAll();

    res.send(all_post_data);
  }

}
