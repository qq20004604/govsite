var express = require('express'); // 调用express模块
var router = express.Router();  // 调用模块的Router方法
var db = require('../models/db');   // 调用刚才封装好的user类


router.get('/', function (req, res, next) {    //当路由捕捉到url为/loadnews的get请求时，会执行以下函数
    //  有type时添加type查询语句；
    //  没有type时，则不添加type（无类型限制）；
    //  有number属性时，类型不符或者没有，则每次查询5个；大于20或小于0，则查询20个；0~20之间，取其整数作为查询条件
    if (!req.session.user) {
        return res.send({
            code: 500,
            data: "you don't have permissions"
        });
    }

    var number = null;
    //console.log(req.query);   //这个是url中，问号后面拼接出来的对象
    if (!req.query.number || typeof req.query.number !== 'number') {
        number = 5;
    } else if (req.query.number > 20 || req.query.number < 0) {
        number = 20;
    } else {
        number = req.query.number.toFixed(0);
    }

    var str = 'select * from news';
    var arr = [];
    // console.log(typeof req.query.type);
    //  遍历查询字段语句SHOW FULL FIELDS FROM news;
    if (typeof req.query.type !== 'string' && typeof req.query.type !== 'undefined') {
        return res.send({
            code: 500,
            data: "error input"
        });
    } else if (typeof req.query.type !== 'undefined' && req.query.type.length !== 0) {
        str += ' where type = ?';
        arr.push(req.query.type);
    }
    str += ' limit ?';
    arr.push(number);
    // console.log(str);
    // console.log(arr);
    var load = new LoadNews();
    load.get(str, arr,
        function (err, result) {
            if (result) { //如果第二个参数存在，说明用户名重复了，返回提示
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

})
function LoadNews() {       // 这是一个User类，传递的参数是一个对象，这个对象可以具有两个属性，分别是name和password

}

// 模板读取函数
LoadNews.prototype.get = function (str, arr, callback) {
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
module.exports = router;
