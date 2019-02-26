const db = require("../models/index");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const nodemailer = require("nodemailer");
const config = require(__dirname + '/../config/config.json')
const fs = require('fs');
const Op = db.Sequelize.Op;
const secret = config.secret;


module.exports = {
    PostAll: async function (req, res) {

        let decode = req.headers.idPerson;
        let allDataPosts = null;
        if (typeof req.query.text === "undefined") {
            //TODO: Эту ветку можно полностью убрать и в моделях тоже,
            // TODO: изначально я хотел ILIKE Сделать с помощью sequelize но там я не мог
            //TODO: такую конструкцию %Text% возможно ли это?
            allDataPosts = await db.post.prototype.allDataPosts(decode, req.query.offset, 0);

        } else {
            allDataPosts = await db.post.prototype.searchPost(req.query.text, req.query.offset, decode);

        }

        res.json({result: allDataPosts});
    },
    lengthRowsMyPosts: async function (req, res, next) {
        let user = req.headers.idPerson;
        try {
            let dataPosts = await db.post.findAll({
                attributes: ["id"],
                where: {
                    [Op.and]: [{
                        private: req.query.private
                    }, {
                        idUser: user
                    }]
                }

            });
            res.json({length: dataPosts.length});
        }
        catch (e) {
            next(e);
        }
    },

    onePersonPosts: async function (req, res, next) {
        try {
            let {id, offset, private} = req.query;
            let result;

            if(!id){
                id = req.headers.idPerson;
            }
            if (private) {
                console.log("problem1")
                result = await db.post.prototype.onePersonPosts(id, req.query.private, req.query.offset,req.headers.idPerson);

            }
            else {
                result = await db.post.prototype.onePersonPosts(id, 0, offset, req.headers.idPerson);
                }
            res.json({result: result});
        } catch (e) {
            next(e);
        }
    },

    getLengthRows: async function (req, res) {
        let data = null;
        let {id, private, searchText} = req.query;
        console.log(req.query)

        if (id == "all") {
            if (typeof searchText === "undefined") {
                    data = await db.post.prototype.getLenRows(private);


            } else {
                data = await db.post.prototype.getLenRows(private, searchText);

            }
        } else if(id == "allPrivatePost") {
            data = await db.post.prototype.getLenRows(private,"",null,req.headers.idPerson);
        }
        else {
            data = await db.post.prototype.getLenRows(private, "", req.query.id)

            res.json({length: data});
            return null;
        }

        res.json({length: Number(data[0].count)});
    },
    showFriends: async function (req, res) {
        let user = req.headers.idPerson;
        let friends = await db.User.prototype.showFriends(req.query.offset, user, req.query.relationship,req.query.text)

        if (req.query.offset == "length") {

            res.json({length: friends});
        } else {
            res.json({friends: friends});
        }
    },
    onlyFriends: async function (req, res) {
        let {id, offset} = req.query;
        let result = null;
        let user = req.headers.idPerson;

        if (id == "all" || id=="allPrivatePost") {
            result = await db.post.prototype.allDataPosts(user, req.query.offset, 1);

        } else {
            result = await db.post.prototype.onePersonPosts(id, 0, offset, req.headers.idPerson);
        }

        res.json({result: result});
    },

    addPost: async function (req, res, next) {
        try {
            const decode = jwt.verify(req.body.id, secret)
            await db.post.create({
                name: req.body.hashteg,
                message: req.body.message,
                image: "/public/images/PostAll/" + req.files[0].filename,
                percent: 0,
                yes: 0,
                no: 0,
                idUser: decode.userid,
                private: req.body.private
            });
            res.status(200).send("Ok");
        } catch (e) {
            next(e);
        }
    },
    Authorization: async function (req, res, next) {
        try {
            let {password, email} = req.body;
            let user = await db.User.prototype.oneUser(email);

            if (user) {
                let hashPassword = bcrypt.hashSync(password, user.salt)
                if (user.password !== hashPassword) {
                    res.status(401).send('Вели неправильный пароль!');
                } else {
                    const token_authorization = jwt.sign({userid: user.id}, secret);
                    res.json({token: token_authorization});
                }
            } else {
                res.status(404).send('Пользователя не существуют!');
            }
        } catch (ex) {
            next(ex);
        }

    },
    register_user: async function (req, res, next) {
        try {

            let {login, password, email} = req.body;
            let user = await db.User.prototype.oneUser(email);
            if (!user) {
                let salt = bcrypt.genSaltSync(10);
                let hash_password = bcrypt.hashSync(password, salt);
                let data = await db.User.prototype.createNewUser({
                    login: login,
                    password: hash_password,
                    salt: salt,
                    face: "assets/images/persons/inkognito.jpg",
                    email: email
                });
                const token_register = jwt.sign({userid: data.id}, secret);
                res.json({token: token_register});
            } else {
                res.status(401).send("Пользователь с таким email уже зарегистрирован!");
            }
        } catch (e) {
            next(e);
        }

    },
    getReaction: async function (req, res, next) {
        try {
            await db.reaction.prototype.createNewReaction({
                idPerson: req.headers.idPerson,
                idPost: req.body.post.id,
                reaction: req.body.reaction,
                private: req.body.private
            });
            let percent = await db.post.prototype.incrementYesOrNo(req.body.post.id, req.body.reaction);
            res.json({percent: percent});
        } catch (e) {
            next(e);
        }
    },

    follows: async function (req, res,next) {
        try {
            let user = req.headers.idPerson;
            await db.follow.prototype.subscribe(user, req.body.follows);
            res.status(200).send("Ok")
        } catch (e) {
            next(e);
        }


    },
    removeFace: async function (req, res,next) {
        try {

            let user = req.headers.idPerson;
            await db.User.prototype.newFace(user,req.files[0].filename);

            res.send("public/images/persons/" + req.files[0].filename);

        } catch (e) {
            next(e);
        }


    },
    removePassword: async function (req, res, next) {
        try {
            let {newPassword, oldPassword} = req.body;
            let test = await db.User.prototype.removePassword(oldPassword, newPassword, req.headers.idPerson);
            if (test) {
                res.status(200).send(true);

            } else {
                res.status(401).send("Ввели неправильнный пароль!");
            }
        } catch(e) {
            next(e);
        }
    },
    forgetPass: async function (req, res, next) {

        try {
            let email = req.body.email;
            let code = String(Math.random().toString(9).substring(2, 8));
            let checkEmail = await db.User.prototype.updateCodeEmail(email, code);
            if (checkEmail[0] === 1) {
                let transporter = nodemailer.createTransport({
                    service: 'gmail',
                    auth: {
                        user: 'YesNoApp1@gmail.com',
                        pass: 'sendemail1'
                    }
                });
                let html = '<h3>' + code + '</h3>'
                const mailOptions = {
                    from: 'YesNoApp1@gmail.com', //
                    to: req.body.email,
                    subject: 'Подтверждение изменения пароля в YesNo',
                    html: html//
                };
                transporter.sendMail(mailOptions, function (err, info) {
                    if (err) {
                        console.log(err);
                        next(err);
                    }
                    else {
                        console.log(info);
                        next(err);
                    }
                });
                res.send(200);
            } else {
                res.status(404).send('Пользователя не существуют!');

            }
        } catch (e) {
            next(e);
        }

    },
    newPassword: async function (req, res, next) {
        try {
            let {email, pass, code} = req.body;
            let salt = bcrypt.genSaltSync(10);
            let password = bcrypt.hashSync(pass, salt);
            let checkUpdatePass = await db.User.prototype.updatePassword(email, code, password, salt);
            if (checkUpdatePass[0] !== 1) {
                res.status(401).send("Неверный код");
            }
            res.sendStatus(200);

        } catch (e) {
            next(e)
        }
    },
    getImage: async function(req,res,next){
        try{
                let face = await db.User.prototype.getImage(req.headers.idPerson);

                res.json({pathImg:face.face});
        } catch (e) {
            next(e);
        }
    },
    deletePost: async function (req, res, next) {
        try {
            let post = await db.post.prototype.deletePost(req.params.id);

            if (post) {

                fs.unlinkSync(__dirname + "/.." + post.image);
                res.sendStatus(200);
            }

        } catch (e) {
            next(e)
        }
    },
    deleteFollow: async function (req, res, next) {
        try {
            var user = req.headers.idPerson;
            await db.follow.prototype.deleteFollow(user, req.params.id);
            res.status(200).send("Ok");

        } catch (e) {
            next(e);
        }
    }

}
