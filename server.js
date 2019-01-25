var express = require("express");
var db = require("./models/index");
var jwt = require('jsonwebtoken');
const config = require( './config/config.json')
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
           var id = jwt.verify(req.headers.token, config.secret).userid
            db.User.findById(id)
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
app.use('/api', checkToken)
//app.use(cors());

app.get("/api/PostAll",controller.PostAll);
app.get("/api/PrivateData", controller.PrivateData);
app.get("/api/users", controller.allUsers)
app.get("/api/OnePersonPosts", controller.onePersonPosts)
app.get("/api/getLengthRows", controller.getLengthRows)
app.get("/api/showFriends", controller.showFriends)
app.get("/api/onlyFriends", controller.onlyFriends)


app.get("/api/test", controller.test)
app.post("/api/myReactions", controller.myReactions)

app.get('/api/friends', controller.getFriends)

app.post("/registration/", controller.register_user);
app.post('/api/addPost',upload.array('image'), controller.addPost)
app.post('/api/addPrivatePost',upload.array('image'), controller.addPrivatePost)
app.post('/authorization/', controller.Authorization);
app.post('/api/follow', controller.follows)
app.get('/api/friends', controller.getFriends)
app.post('/api/removeFace',upload_face.array('image'), controller.removeFace)
app.post('/api/removePassword', controller.removePassword)
app.post('/api/getReaction', controller.getReaction)


app.delete('/api/follow/delete:id',controller.deleteFollow)



server.listen(8000);
console.log("Запуск сервера..");
