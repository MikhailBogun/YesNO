var express = require("express");
var app = express();
var multer  = require('multer')
console.log(Date.now())
var storage = multer.diskStorage( {
  destination: function (req, file, cb) {
    cb(null, '/Users/sooprit/project/yesno/src/assets/images/PostAll')
    console.log(file.fieldname)
    console.log(file.fieldname+'-'+Date.now())
  },
  filename: function(req,file, cb){
  cb(null, file.fieldname +'-'+Date.now()+'.jpg');

}
});
var upload = multer({ storage: storage });

//var router = express.Router();

var cors = require("cors");
//var path = requeire("path");
var multer = require("multer");
var server = require("http").createServer(app);
var bodyparser = require("body-parser");

var controller = require(__dirname + "/controllers/controller");
//app.use(multer({dest: './uploads/'}).single("photo"));
//router.use(multer({dest:'./uploads/'}));
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended:true }));
app.use("/", express.static(__dirname + "/"));
app.use(cors());

app.get("/PostAll", controller.PostAll);
app.post("/registration_user", controller.register_user);
app.post('/addPost',upload.array('image'), controller.addPost)

server.listen(8000);
console.log("Запуск сервера..");
