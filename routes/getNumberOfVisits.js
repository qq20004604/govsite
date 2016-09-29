var express = require('express'); // 调用express模块
var db = require('../models/db')
var router = express.Router();  // 调用模块的Router方法

router.get("/", function (req, res, next) {
    var record = new VisitsRecord();
    record.get(function (err, result) {
        if (err) {  //如果报错，返回报错信息
            console.log(err);
        }
        return res.send({
            data: result
        })
    });
})

function VisitsRecord() {       // 这是一个User类，传递的参数是一个对象，这个对象可以具有两个属性，分别是name和password

}

// 获取已访问的人数
VisitsRecord.prototype.get = function (callback) {
    var selectResult;
    db.con(function (connect) {
        connect.query('select count(*) from visitsrecord', [], function (err, result) {
            if (err) {  //报错
                console.log("select count(*) from visitsrecord err information is: " + err);
                return callback(err, "未能获取已访问人数");
            }
            //注意，这里返回的是带账号和密码的，另外，理论上是有可能有多个元素的，但由于在注册时，用户名限制了重复，因此只会返回一个
            selectResult = result;  //这里的result是一个数组，只包含一个元素（或者是空）
            if (selectResult.length) {  //查询到的话，数组是有元素的（即length > 0）
                return callback(null, selectResult[0]['count(*)']) //这里的selectResult就是user对象，包含name和password属性
            } else {
                return callback(null, null);    //如果查询不到，两个参数都为空
            }
        })
    })
}

module.exports = router;