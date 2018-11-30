var express = require("express");
var app = express();
//var router = express.Router();

var cors = require("cors");
//var path = requeire("path");
var multer = require("multer");
var server = require("http").createServer(app);
var bodyparser = require("body-parser");

var controller = require(__dirname + "/controllers/controller");
app.use(multer({dest: './uploads/'}).single("photo"));
//router.use(multer({dest:'./uploads/'}));
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended:true }));
app.use("/", express.static(__dirname + "/"));
app.use(cors());

app.get("/PostAll", controller.PostAll);
app.post("/registration_user", controller.register_user);
app.post('/addPost', controller.addPost)

server.listen(8000);
console.log("Запуск сервера..");
