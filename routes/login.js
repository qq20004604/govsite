var express = require('express'); // 调用express模块
var router = express.Router();  // 调用模块的Router方法
var db = require('../models/db');

router.post('/', function (req, res, next) {    //当路由捕捉到url为/reg的post请求时，会执行以下函数
    //如果是已登录，则自动登录
    if ('user' in req.session && req.session.user) {
        return res.send({
            code: 200,
            data: {
                username: req.session.username
            }
        });
    }
    //如果不是，则查看请求内容，如果是查询是否已登录，则返回未登录
    else if ('haveLogined' in req.body) {
        return res.send({
            code: 500,
            data: "have not logined"
        });
    }
    var newUser = new User(req.body);
    newUser.get(function (err, user) {
        if (user) { //说明有用户
            //允许登录
            if (user.userpassword === req.body.userpassword) {
                req.session.user = user;
                return res.send({
                    code: 200,
                    data: {
                        username: user.username
                    }
                });
            } else {    //密码错误
                return res.send({
                    code: 400,
                    data: "password error"
                });
            }
        }
        if (err) {  //如果报错，返回报错信息
            console.log(err);
            return res.send({
                code: 500,
                data: "server error"
            });
        }
        //没有查询到任何内容，则说明账号错误
        return res.send({
            code: 501,
            data: "no result"
        });
    })
})
function User(user) {       // 这是一个User类，传递的参数是一个对象，这个对象可以具有两个属性，分别是name和password
    this.username = user.username;  // 如果传递的user不是空，那么将其赋值给User类的实例的name属性
    this.userpassword = user.userpassword;  // 同上，赋给password属性
}
// 这个是查询方法
User.prototype.get = function (callback) {
    var self = this;
    if (this.username.length == 0) {    //如果在没账号/密码的情况下就调用插入方法，则提示错误并返回
        console.log("You can't select user information without NAME!");
        return callback("You can't select user information without NAME!");
    }
    var selectResult;
    db.con(function (connect) {
        connect.query('SELECT * FROM manager WHERE username = ?', [self.username], function (err, result) {
            if (err) {  //报错
                console.log("select name:" + self.username + " error, the err information is " + err);
                return callback(err);
            }
            //注意，这里返回的是带账号和密码的，另外，理论上是有可能有多个元素的，但由于在注册时，用户名限制了重复，因此只会返回一个
            selectResult = result;  //这里的result是一个数组，只包含一个元素（或者是空）
            if (selectResult.length) {  //查询到的话，数组是有元素的（即length > 0）
                return callback(null, selectResult[0]) //这里的selectResult就是user对象，包含name和password属性
            } else {
                return callback(null, null);    //如果查询不到，两个参数都为空
            }
        })
    })
}

module.exports = router;