var express = require('express'); // 调用express模块
var router = express.Router();  // 调用模块的Router方法
var db = require('../models/db');   // 调用刚才封装好的user类


router.get('/', function (req, res, next) {    //当路由捕捉到url为/loadnews的get请求时，会执行以下函数
    //  【1】有id则查询指定id新闻
    //  【2】有area（可以有haveText属性），则范围查询（type生效）；
    //  【3】有type时添加type查询语句；没有type时，则不添加type（无类型限制）；
    //  【4】有number属性时，类型不符或者没有，则每次查询5个；大于20或小于0，则查询20个；0~20之间，取其整数作为查询条件
    //  【5】由于查询字符串拼接是跟ajax收到信息间接相关，因此安全性是ok的。另外，nodejs的mysql模块默认禁止将多个查询语句拼接到一起

    //  *****  id  *****
    //  使用id时只能查询到一个
    var str = 'select * from news';
    //  首先判断是否有id，有则处理之
    if (req.query.id && Number(req.query.id) > 0) {
        str += ' where Id = ?';
        LoadNews(str, [req.query.id], function (err, result) {
            if (result) { //如果第二个参数存在，说明用户名重复了，返回提示
                //需要对结果进行处理
                var resData = dealWithResult(result, true); //根据id查询会获取正文
                return res.send({
                    code: 200,
                    data: resData
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
        return;
    }

    var arr = [];   //这个是查询的参数
    // *****  area/haveText/type  *****
    if (req.query.area instanceof Array) {
        if (typeof req.query.type === 'string') {
            str += ' where type = ?';
            arr.push(req.query.type);
        }
        if (isNaN(Number(req.query.area[0])) && isNaN(Number(req.query.area[1]))) {
            return res.send({
                code: 500,
                data: "error input"
            });
            return;
        } else {
            str += ' limit ?,?';
            arr.push(Number(req.query.area[0]));
            arr.push(Number(req.query.area[1]));
        }

        var haveText = false;
        if (req.query.haveText === 'true') {
            haveText = true;
        }
        LoadNews(str, arr,
            function (err, result) {
                if (result) { //如果第二个参数存在，说明用户名重复了，返回提示
                    //需要对结果进行处理
                    var resData = dealWithResult(result, haveText);
                    return res.send({
                        code: 200,
                        data: resData
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
        return;
    }


    // *****  number/type  *****
    var number = null;
    var queryNumber = Number(req.query.number);
    if (!req.query.number || isNaN(queryNumber)) {
        number = 5;
    } else if (queryNumber > 20 || queryNumber <= 0) {
        number = 20;
    } else {
        number = queryNumber.toFixed(0);
    }

    //  最后判断类型查询
    if (typeof req.query.type !== 'string' && typeof req.query.type !== 'undefined') {
        //有type但类型不对
        return res.send({
            code: 500,
            data: "error input"
        });
    } else if (typeof req.query.type !== 'undefined' && req.query.type.length !== 0) {
        str += ' where type = ?';
        arr.push(req.query.type);
    }
    str += ' limit ?';
    arr.push(Number(number));
    // console.log(str);
    // console.log(arr);
    LoadNews(str, arr,
        function (err, result) {
            if (result) { //如果第二个参数存在，说明用户名重复了，返回提示
                //需要对结果进行处理
                var resData = dealWithResult(result);
                return res.send({
                    code: 200,
                    data: resData
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

})

// 模板读取函数
function LoadNews(str, arr, callback) {       // 这是一个User类，传递的参数是一个对象，这个对象可以具有两个属性，分别是name和password
    var selectResult;
    db.con(function (connect) {
        connect.query(str, arr, function (err, result) {
            if (err) {  //报错
                console.log(str + " error information is: " + err);
                return;
            }
            //注意，这里返回的是带账号和密码的，另外，理论上是有可能有多个元素的，但由于在注册时，用户名限制了重复，因此只会返回一个
            selectResult = result;  //这里的result是一个数组，只包含一个元素（或者是空）
            if (selectResult.length) {  //查询到的话，数组是有元素的（即length > 0）
                return callback(null, selectResult) //这里的selectResult就是user对象，包含name和password属性
            } else {
                return callback(null, null);    //如果查询不到，两个参数都为空
            }
        })
    })
}

//对从数据库里获取的结果进行处理，如果有第二个参数的话，表示有正文，默认无
function dealWithResult(result, haveText) {
    var arr = [];
    result.forEach(function (item) {
        var obj = {
            id: item.Id,
            title: item.title,
            editor: item.editor,
            ctime: item.ctime,
            type: item.type
        };
        if (haveText) {
            obj.text = item.text;
        }
        arr.push(obj);
    })
    return arr;
}


module.exports = router;
