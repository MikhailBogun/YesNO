var express = require("express");
var app = express();
var multer  = require('multer')
var storage = multer.diskStorage( {
  destination: function (req, file, cb) {
    cb(null, '/Users/sooprit/project/yesno/client/src/assets/images/PostAll')

  },
  filename: function(req,file, cb){
  cb(null, file.fieldname +'-'+Date.now()+'.jpg');

}
});
var storage_face = multer.diskStorage( {
  destination: function (req, file, cb) {
    cb(null, '/Users/sooprit/project/yesno/client/src/assets/images/persons')

  },
  filename: function(req,file, cb){
    cb(null, file.fieldname +'-'+Date.now()+'.jpg');

  }
});
var upload = multer({ storage: storage });
var upload_face = multer({ storage: storage_face });

//var router = express.Router();

//var cors = require("cors");
//var path = requeire("path");
var server = require("http").createServer(app);
var bodyparser = require("body-parser");

var controller = require(__dirname + "/controllers/controller");
//app.use(multer({dest: './uploads/'}).single("photo"));
//router.use(multer({dest:'./uploads/'}));
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended:true }));
app.use("/", express.static(__dirname + "/"));
//app.use(cors());

app.get("/api/PostAll", controller.PostAll);
app.get("/api/PrivateData", controller.PrivateData);
app.get("/api/users", controller.allUsers)
app.post("/api/myReactions", controller.myReactions)

app.post("/api/registration_user", controller.register_user);
app.post('/api/addPost',upload.array('image'), controller.addPost)
app.post('/api/addPrivatePost',upload.array('image'), controller.addPrivatePost)
app.post('/api/authorization', controller.Authorization);
app.post('/api/follow', controller.follows)
app.post('/api/friends', controller.getFriends)
app.post('/api/removeFace',upload_face.array('image'), controller.removeFace)
app.post('/api/removePassword', controller.removePassword)
app.post('/api/getReaction', controller.getReaction)



server.listen(8000);
console.log("Запуск сервера..");
