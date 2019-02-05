const express = require("express");
const db = require("./models/index");
const jwt = require('jsonwebtoken');
const config = require( './config/config.json')
const app = express();
const multer  = require('multer')
let server = require("http").createServer(app);
let bodyparser = require("body-parser");

let storage = multer.diskStorage( {
  destination: function (req, file, cb) {
    cb(null, '/Users/sooprit/project/yesno/public/images/PostAll')
  },
  filename: function(req,file, cb){
  cb(null, Date.now()+file.originalname);
  }
});

let storage_face = multer.diskStorage( {
  destination: function (req, file, cb) {
    cb(null, '/Users/sooprit/project/yesno/client/src/assets/images/persons')

  },
  filename: function(req,file, cb){
    cb(null, file.fieldname +'-'+Date.now()+'.jpg');

  }
});

let controller = require(__dirname + "/controllers/controller");
let upload = multer({ storage: storage });
let upload_face = multer({ storage: storage_face });

let checkToken = function(req, res, next) {
    try{
    if (typeof req.headers.token === 'undefined') {
        res.sendStatus(401);
    } else {
           let id = jwt.verify(req.headers.token, config.secret).userid;
            db.User.findById(id)
                .then(user => {
                  if(typeof user.id !== 'undefined'){
                    req.headers.idPerson = user.id;
                      next()
                  } else{
                    res.sendStatus(404)
                  }
                });
    }
    } catch{
    res.sendStatus(403)
    }
}




app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended:true }));
app.use("/", express.static(__dirname + "/"));
app.use('/',express.static(__dirname+'/public/images'))
app.use('/api', checkToken)
app.use('/authorization/',function(err, req, res, next) {

    if(err.stack=='Пользователя несуществует!') {
        res.status(404).send('Пользователя не существуют!');

    } else if(err.stack=="Вели неправильный пароль!") {
        res.status(401).send('Вели неправильный пароль!');

    } else {
        res.status(500).send('Ошибка сервера!');

    }
})


app.get("/api/PostAll",controller.PostAll);
// app.get("/api/PrivateData", controller.PrivateData);
app.get("/api/OnePersonPosts", controller.onePersonPosts);
app.get("/api/getLengthRows", controller.getLengthRows);
app.get('/api/lengthRowsMyPosts', controller.lengthRowsMyPosts);
app.get("/api/showFriends", controller.showFriends);
app.get("/api/onlyFriends", controller.onlyFriends);


app.get('/api/myPosts', controller.myPosts);

app.get('/api/friends', controller.getFriends);

app.post("/registration/", controller.register_user);
app.post('/api/addPost',upload.array('image'), controller.addPost);


app.post('/authorization/', controller.Authorization);
app.post("/forget/", controller.forgetPass);
app.post("/forget/newPass", controller.newPassword);

app.post('/api/follow', controller.follows);
app.get('/api/friends', controller.getFriends);
app.post('/api/removeFace',upload_face.array('image'), controller.removeFace);
app.post('/api/removePassword', controller.removePassword);
app.post('/api/getReaction', controller.getReaction);


app.delete('/api/follow/delete:id',controller.deleteFollow);

app.delete('/api/deletePost:id',controller.deletePost);

 app.use('/',function(err, req, res, next) {
    if(err=='Пользователя несуществует!') {
        res.status(404).send('Пользователя не существуют!');
    } else if(err=="Вели неправильный пароль!") {
        res.status(401).send('Вели неправильный пароль!');

    } else if(err==1){
        res.status(401).send("Пользователь с таким email уже зарегистрирован!")
    } else if(err=="Неправильный Код"){
        res.status(401).send("Неверный код")

    } else {
        res.status(500).send('Ошибка сервера!');
    }


});

server.listen(8000);
console.log("Запуск сервера..");
