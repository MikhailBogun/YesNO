var express = require("express"); // TODO Используй es6 const / let
var db = require("./models/index"); // TODO Используй es6 const / let
var jwt = require('jsonwebtoken'); // TODO Используй es6 const / let
const config = require( './config/config.json') // TODO пропустил ";"
var app = express(); // TODO Используй es6 const / let
var multer  = require('multer') // TODO пропустил ";" // TODO Используй es6 const / let
var storage = multer.diskStorage( { // TODO Используй es6 const / let
  destination: function (req, file, cb) {
    cb(null, '/Users/sooprit/project/yesno/public/images/PostAll') // TODO что єто за путь? если запустить на другой машине где нет /Users/sooprit/project/yesno/
// TODO Убрать пустые строки
  },
  filename: function(req,file, cb){
  cb(null, Date.now()+file.originalname);
// TODO Убрать пустые строки
}
});
var storage_face = multer.diskStorage( {  // TODO Используй es6 const / let
  destination: function (req, file, cb) {
    cb(null, '/Users/sooprit/project/yesno/client/src/assets/images/persons') // TODO что это за путь? если запустить на другой машине где нет /Users/sooprit/project/yesno/
// TODO Убрать пустые строки
  },
  filename: function(req,file, cb){
    cb(null, file.fieldname +'-'+Date.now()+'.jpg'); // TODO твой сервер принимает только .jpg?
// TODO Убрать пустые строки
  }
});
var controller = require(__dirname + "/controllers/controller");  // TODO Используй es6 const / let
var upload = multer({ storage: storage });  // TODO Используй es6 const / let
var upload_face = multer({ storage: storage_face });  // TODO Используй es6 const / let

//var router = express.Router();  // TODO убрать коментарий
var checkToken = function(req, res, next) { // TODO снизу показал пример как надо было написать эту функцию
    console.log("Zdes token") // TODO пропустил ";", убрать ненужние логи
    console.log(req.headers.token)// TODO пропустил ";"
    console.log("Neprishol") // TODO Убрать пустые строки, убрать ненужние логи
    if (typeof req.headers.token === 'undefined') {
        res.sendStatus(401);
    } else {
        try { // TODO try/catch должен быть глобальный для функции
           var id = jwt.verify(req.headers.token, config.secret).userid // TODO пропустил ";"
            db.User.findById(id) // TODO используй async / await
                .then(user => {
                  if(typeof user.id !== 'undefined'){
                    req.headers.idPerson = user.id;
                      next()
                  } else{
                    res.sendStatus(404)
                  }
// TODO Убрать пустые строки
// TODO Убрать пустые строки
                })
// TODO Убрать пустые строки
        } catch{
          res.sendStatus(403)
        }
    }
}// TODO Убрать пустые строки

const checkTokenExample = async function (req, res, next) {
  try {
    if (!req.headers.token) {
      return res.sendStatus(401);
    }

    const user = await db.User.findById(jwt.verify(req.headers.token, config.secret).userid);

    if (!user) {
      return res.sendStatus(401);
    }

    req.headers.idPerson = user.id;
    next();
  } catch {
    res.sendStatus(401);
  }
};

//var cors = require("cors"); // TODO убрать коментарий
//var path = requeire("path"); // TODO убрать коментарий
var server = require("http").createServer(app); // TODO Используй es6 const / let
var bodyparser = require("body-parser"); // TODO Используй es6 const / let

// TODO Убрать пустую строку
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended:true }));
app.use("/", express.static(__dirname + "/"));
app.use('/',express.static(__dirname+'/public/images')) // TODO пропустил ";"
app.use('/api', checkToken)// TODO пропустил ";"
app.use('/authorization/',function(err, req, res, next) { // TODO не понимаю зачем это?
    cosnole.log("alllogvsd") // TODO пропустил ";"
    //console.error(err.stack);// TODO убрать коментарий
    if(err.stack=='Пользователя несуществует!') {
        res.status(404).send('Пользователя не существуют!');
    } else if(err.stack=="Вели неправильный пароль!") {
        res.status(401).send('Вели неправильный пароль!');
    } else {
        res.status(500).send('Ошибка сервера!');
    }
// TODO Убрать пустую строку
// TODO Убрать пустую строку
})// TODO пропустил ";"
//app.use(cors()); // TODO убрать коментарий

app.get("/api/PostAll",controller.PostAll);
app.get("/api/PrivateData", controller.PrivateData);
app.get("/api/users", controller.allUsers) // TODO пропустил ";"
app.get("/api/OnePersonPosts", controller.onePersonPosts) // TODO пропустил ";"
app.get("/api/getLengthRows", controller.getLengthRows) // TODO пропустил ";"
app.get('/api/lengthRowsMyPosts', controller.lengthRowsMyPosts) // TODO пропустил ";"
app.get("/api/showFriends", controller.showFriends) // TODO пропустил ";"
app.get("/api/onlyFriends", controller.onlyFriends);


app.get('/api/myPosts', controller.myPosts);

app.get('/api/friends', controller.getFriends) // TODO пропустил ";"

app.post("/registration/", controller.register_user);
app.post('/api/addPost',upload.array('image'), controller.addPost) // TODO пропустил ";"


app.post('/authorization/', controller.Authorization);
app.post("/forget/", controller.forgetPass);
app.post("/forget/newPass", controller.newPassword);

app.post('/api/follow', controller.follows) // TODO пропустил ";"
app.get('/api/friends', controller.getFriends) // TODO пропустил ";"
app.post('/api/removeFace',upload_face.array('image'), controller.removeFace) // TODO пропустил ";"
app.post('/api/removePassword', controller.removePassword) // TODO пропустил ";"
app.post('/api/getReaction', controller.getReaction) // TODO пропустил ";"


app.delete('/api/follow/delete:id',controller.deleteFollow) // TODO пропустил ";"

app.delete('/api/deletePost:id',controller.deletePost) // TODO пропустил ";"

 app.use('/',function(err, req, res, next) { // TODO не понимаю зачем это?
    console.log("alllogvsd") // TODO пропустил ";"
    //console.error(err.stack);  // TODO убрать коментарий
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


})// TODO пропустил ";" , отделяй функции друг от друга переходом на другую строку
server.listen(8000);
console.log("Запуск сервера..");
