var express = require('express'); // 调用express模块
var router = express.Router();  // 调用模块的Router方法

router.get('/', function (req, res, next) {
    next()
});

module.exports = router;