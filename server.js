var express = require("express");
var app = express();
var multer  = require('multer')
var storage = multer.diskStorage( {
  destination: function (req, file, cb) {
    cb(null, '/Users/sooprit/project/yesno/public/images/PostAll')

  },
  filename: function(req,file, cb){
  cb(null, Date.now()+file.originalname);

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
var controller = require(__dirname + "/controllers/controller");
var upload = multer({ storage: storage });
var upload_face = multer({ storage: storage_face });

//var router = express.Router();
var checkToken = function(req, res, next) {
    console.log("Zdes token")
    console.log(req.headers.token)
    if (typeof req.headers.token === 'undefined') {
        res.sendStatus(401);
    } else {
        try {
           var id =  controller.jwt.verify(req.headers.token, controller.secret).userid
            controller.db.User.findById(id)
                .then(user => {
                  if(typeof user.id !== 'undefined'){
                    req.headers.idPerson = user.id;
                      next()
                  } else{
                    res.sendStatus(404)
                  }


                })

        } catch{
          res.sendStatus(403)
        }
    }
}
//var cors = require("cors");
//var path = requeire("path");
var server = require("http").createServer(app);
var bodyparser = require("body-parser");


//app.use(multer({dest: './uploads/'}).single("photo"));
//router.use(multer({dest:'./uploads/'}));
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended:true }));
app.use("/", express.static(__dirname + "/"));
app.use('/',express.static(__dirname+'/public/images'))
//app.use(cors());

app.get("/api/PostAll",checkToken,controller.PostAll);
app.get("/api/PrivateData",checkToken, controller.PrivateData);
app.get("/api/users", controller.allUsers)
app.get("/api/OnePersonPosts",checkToken, controller.onePersonPosts)
app.get("/api/getLengthRows",checkToken, controller.getLengthRows)
showFriends
app.get("/api/showFriends",checkToken, controller.showFriends)
app.get("/api/onlyFriends",checkToken, controller.onlyFriends)


app.get("/api/test",checkToken, controller.test)
app.post("/api/myReactions", controller.myReactions)

app.get('/api/friends',checkToken, controller.getFriends)

app.post("/api/registration_user", controller.register_user);
app.post('/api/addPost',upload.array('image'), controller.addPost)
app.post('/api/addPrivatePost',upload.array('image'), controller.addPrivatePost)
app.post('/api/authorization', controller.Authorization);
app.post('/api/follow',checkToken, controller.follows)
app.get('/api/friends',checkToken, controller.getFriends)
app.post('/api/removeFace',upload_face.array('image'), controller.removeFace)
app.post('/api/removePassword', controller.removePassword)
app.post('/api/getReaction', controller.getReaction)


app.delete('/api/follow/delete:id',checkToken,controller.deleteFollow)



server.listen(8000);
console.log("Запуск сервера..");
