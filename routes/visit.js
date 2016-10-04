var express = require('express'); // 调用express模块
var db = require('../models/db');
var router = express.Router();  // 调用模块的Router方法

router.get("/:anyurl", function (req, res, next) {
    var record = new VisitsRecord(req.connection.remoteAddress, "/" + req.params.anyurl);
    record.save();
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
    var time = new Date().getTime();
    db.con(function (connect) {
        connect.query('INSERT VISITSRECORD (ip, ctime, url) values(?,?,?)', [self.ip, time, self.URL], function (err, result) {
            if (err) {  //报错
                console.log("INSERT VISITSRECORD err information is: " + err);
                return;
            }
        })
    })
}

module.exports = router;