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
      //let all_users_data = await db.PostAll.findAll();
      //res.send(all_users_data+"Hello World!");
      res.send(books);
    }

}
