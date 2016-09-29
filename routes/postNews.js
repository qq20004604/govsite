var express = require('express'); // 调用express模块
var router = express.Router();  // 调用模块的Router方法
var db = require('../models/db');   // 调用刚才封装好的user类


router.post('/', function (req, res, next) {    //当路由捕捉到url为/reg的post请求时，会执行以下函数
    if (!req.session.user) {
        return res.send({
            code: 401,
            data: "You are not allowed post news to Server"
        });
    }
    console.log(req.session.user);
    var postnews = new SaveNews();
    postnews.save('INSERT news(editor, ctime, title, text, type) values(?, ?, ?, ?, ?)',
        [req.session.user.username, new Date().getTime(), req.body.title, req.body.text, req.body.type],
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
                    data: "server error"
                });
            }
            return res.send({
                code: 501,
                data: "nothing loaded."
            })
        })
})
function SaveNews() {       // 这是一个User类，传递的参数是一个对象，这个对象可以具有两个属性，分别是name和password

}

// 模板存储函数
SaveNews.prototype.save = function (str, arr, callback) {
    db.con(function (connect) {
        connect.query(str, arr, function (err, result) {
            if (err) {  //报错
                console.log(str + " error information is: " + err);
                return callback(err, null);
            }
            return callback(null, "success");
        })
    })
}
module.exports = router;
