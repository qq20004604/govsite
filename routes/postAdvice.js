var express = require('express'); // 调用express模块
var router = express.Router();  // 调用模块的Router方法
var db = require('../models/db');   // 调用刚才封装好的user类


router.post('/', function (req, res, next) {    //当路由捕捉到url为/reg的post请求时，会执行以下函数
    //管理员提交
    //如果有id，说明是管理员提交，需要检查session
    if (req.body.id) {
        if (!req.session.user) {
            return res.send({
                code: 401,
                data: "You are not allowed post advice to Server"
            });
        }
        var manageArray = [req.body.response, new Date().getTime(), req.body.id];
        SaveAdvice('UPDATE advice set response = ?,  mtime = ? where id = ?', manageArray,
            function (err, result) {
                if (result) {   //有结果
                    return res.send({
                        code: 200,
                        data: "success"
                    });
                }
                if (err) {  //如果报错，返回报错信息
                    console.log(err);
                    return res.send({
                        code: 500,
                        data: "server error"
                    });
                }
                return res.send({
                    code: 501,
                    data: "nothing found."
                })
            })
        return;
    }

    if (typeof req.body.title === 'undefined' || typeof req.body.text === 'undefined' || typeof req.body.tel === 'undefined') {
        return res.send({
            code: 500,
            data: "error post advice"
        });
    }
    var userArray = [new Date().getTime(), req.body.title, req.body.text, Number(req.body.tel)];
    SaveAdvice('INSERT advice (ctime, title, text, tel) values(?, ?, ?, ?)', userArray,
        function (err, result) {
            if (result) {   //有结果
                return res.send({
                    code: 200,
                    data: result.insertId  //只返回id
                });
            }
            if (err) {  //如果报错，返回报错信息
                console.log(err);
                return res.send({
                    code: 500,
                    data: "server error"
                });
            }
            return res.send({
                code: 501,
                data: "nothing loaded."
            })
        })
})

// 模板存储函数
function SaveAdvice(str, arr, callback) {       // 这是一个User类，传递的参数是一个对象，这个对象可以具有两个属性，分别是name和password
    var selectResult;
    db.con(function (connect) {
        connect.query(str, arr, function (err, result) {
            if (err) {  //报错
                console.log(str + " error information is: " + err);
                return callback(err, null);
            }
            selectResult = result;  //这里的result是一个数组，只包含一个元素（或者是空）
            if (selectResult.insertId || selectResult.changedRows) {  //查询到的话，数组是有元素的（即length > 0）
                return callback(null, selectResult) //这里的selectResult就是user对象，包含name和password属性
            } else {
                return callback(null, null);    //如果查询不到，两个参数都为空
            }
        })
    })
}

module.exports = router;
