var express = require('express'); // 调用express模块
var router = express.Router();  // 调用模块的Router方法
var db = require('../models/db');
var fun = require('../models/fun');

router.all("/*", function (req, res, next) {
    var url = "/" + req.params[0];
    //如果后缀名不是以下，则记录ip
    if (!/\.(css|js|png|jpg|json|jpeg|ico)$/.test(url)) {
        var record = new VisitsRecord(fun.getIP(req), url);
        record.save();
    }
    next();
})

function VisitsRecord(ip, url) {       // 这是一个User类，传递的参数是一个对象，这个对象可以具有两个属性，分别是name和password
    this.ip = ip;
    this.URL = url;
    if (this.URL.length > 255) {    //对于url太长，进行处理
        this.URL = this.URL.substring(0, 254);
    }
}

// 这个是保存访问记录
VisitsRecord.prototype.save = function () {
    var self = this;
    db.con(function (connect) {
        connect.query('INSERT visitsrecord (ip, ctime, url) values(?,?,?)', [self.ip, fun.getNowTime(), self.URL], function (err, result) {
            if (err) {  //报错
                console.log("INSERT VISITSRECORD err information is: " + err);
                return;
            }
        })
    })
}

module.exports = router;