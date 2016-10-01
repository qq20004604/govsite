var express = require('express'); // 调用express模块
var router = express.Router();  // 调用模块的Router方法
var db = require('../models/db');   // 调用刚才封装好的user类

//根据id删除新闻
router.delete('/', function (req, res, next) {
    //必须有session才能删除
    if (!req.session.user) {
        return res.send({
            code: 500,
            data: "You are not allowed to delete news."
        });
    }

    //类型验证
    if (!('id' in req.body) || isNaN(parseInt(req.body.id))) {
        return res.send({
            code: 500,
            data: "Error query."
        });
    }

    //确保类型和数值符合
    var id = parseInt(req.body.id);
    var str = 'delete from news where id = ?';
    var arr = [id];

    DeleteNews(str, arr,
        function (err) {
            if (err) {  //如果报错，返回报错信息
                console.log(err);
                return res.send({
                    code: 500,
                    data: "error server"
                });
            }
            return res.send({
                code: 200,
                data: id
            });
        })

})

// 模板删除函数
function DeleteNews(str, arr, callback) {       // 这是一个User类，传递的参数是一个对象，这个对象可以具有两个属性，分别是name和password
    db.con(function (connect) {
        connect.query(str, arr, function (err, result) {
            if (err) {  //报错
                console.log(str + " error information is: " + err);
                return callback(err);
            }
            callback();
        })
    })
}

module.exports = router;
