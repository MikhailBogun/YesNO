var db = require("../models/index");
var path = require("path");
var crypto = require("crypto");
var sha256 = crypto.createHash("sha256");

module.exports = {
    PostAll: async function(req, res){
      books =[
        {
          name:'World!',
        }
      ]
      let all_post_data = await db.PostAll.findAll();
      //let all_users_data = await db.PostAll.findAll();
      //res.send(all_users_data+"Hello World!");
      res.send(all_post_data);
    },
  register_user: async function(req, res){
    let login = req.body.login;
    let password = req.body.password;
    if (!login || !password || login.length == 0 || password.length == 0){
      res.send("Query contains empty fields");
      return;
    }
    let all_users_data = await db.user.findAll();
    all_users_data.forEach(obj => {
      if (obj.dataValues.login == login){
        res.send("There is already login ", login, " in database!");
        return;
      }
    });
    let salt = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    sha256.update(password + salt);
    let hash_password = sha256.digest("base64");
    db.user.create({login:login, password: hash_password, salt:salt})
      .then(u => {res.redirect("/conversations?userId=" + u.dataValues.id, 302);});
  }

}
