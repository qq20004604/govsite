var express = require('express'); // 调用express模块
var router = express.Router();  // 调用模块的Router方法
var db = require('../models/db');

router.get('/', function (req, res, next) {    //当路由捕捉到url为/reg的post请求时，会执行以下函数
    //如果是已登录，则自动登录
    if ('user' in req.session && req.session.user) {
        req.session.user = null;
        return res.send({
            code: 200,
            data: "success"
        });
    }
})
module.exports = router;