var express = require('express'); // 调用express模块
var router = express.Router();  // 调用模块的Router方法
var db = require('../models/db');   // 调用刚才封装好的user类


router.get('/', function (req, res, next) {
    var str = 'select * from advice';

    //  首先判断是否有id，有则处理之
    if (req.query.id && Number(req.query.id) > 0) {
        str += ' where id = ?';
        LoadAdvice(str, [req.query.id], function (err, result) {
            if (result) { //如果第二个参数存在，说明用户名重复了，返回提示
                //需要对结果进行处理
                return res.send({
                    code: 200,
                    data: result
                });
            }
            if (err) {  //如果报错，返回报错信息
                console.log(err);
                return res.send({
                    code: 500,
                    data: "error server"
                });
            }
            return res.send({
                code: 501,
                data: "no more things"
            })
        });
    }

    var arr = [];   //这个是查询的参数
    // *****  area/haveResponse  *****
    if (req.query.area instanceof Array) {
        if (req.query.haveResponse === 'true' || !req.session.user) {    //已回复
            str += ' where mtime > 0';
        }
        else if (req.query.haveResponse === 'false') {  //未回复
            str += ' where mtime = 0';
        }
        if (isNaN(Number(req.query.area[0])) && isNaN(Number(req.query.area[1]))) {
            return res.send({
                code: 500,
                data: "error input"
            });
            return;
        } else {
            str += ' order by id desc';
            str += ' limit ?,?';
            arr.push(Number(req.query.area[0]));
            arr.push(Number(req.query.area[1]));
        }

        LoadAdvice(str, arr,
            function (err, result) {
                if (result) { //如果第二个参数存在，说明用户名重复了，返回提示
                    //需要对结果进行处理
                    return res.send({
                        code: 200,
                        data: result
                    });
                }
                if (err) {  //如果报错，返回报错信息
                    console.log(err);
                    return res.send({
                        code: 500,
                        data: "error server"
                    });
                }
                return res.send({
                    code: 501,
                    data: "no more things"
                })
            })
    }
})

// 模板读取函数
function LoadAdvice(str, arr, callback) {       // 这是一个User类，传递的参数是一个对象，这个对象可以具有两个属性，分别是name和password
    var selectResult;
    db.con(function (connect) {
        connect.query(str, arr, function (err, result) {
            if (err) {  //报错
                console.log(str + " error information is: " + err);
                return;
            }

            selectResult = result;  //这里的result是一个数组，只包含一个元素（或者是空）
            if (selectResult.length) {  //查询到的话，数组是有元素的（即length > 0）
                return callback(null, selectResult) //这里的selectResult就是user对象，包含name和password属性
            } else {
                return callback(null, null);    //如果查询不到，两个参数都为空
            }
        })
    })
}

module.exports = router;
