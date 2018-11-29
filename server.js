var express = require("express");
var app = express();
var cors = require("cors");
//var path = requeire("path");
var server = require("http").createServer(app);
var bodyparser = require("body-parser");

var controller = require(__dirname + "/controllers/controller");
app.use(bodyparser.json())
app.use(bodyparser.urlencoded({ extended:true }));
app.use("/", express.static(__dirname + "/"));
app.use(cors());
app.get("/PostAll", controller.PostAll);
app.post("/register_user", controller.register_user);


server.listen(8000);
console.log("Запуск сервера..");
