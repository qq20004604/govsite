var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');


var app = express();
//session
var session = require('express-session');
app.use(session({
    secret: 'recommend 128 bytes random string',
    cookie: {maxAge: 3600 * 1000}
}))
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//记录访问情况
var Visits = require('./routes/visit');
app.use('/', Visits);
//获取已访问人数
var VisitsNumber = require("./routes/getNumberOfVisits");
app.use('/getVisitsNumber', VisitsNumber);
//登录
var Login = require("./routes/login");
app.use('/login', Login);
//注销
var logout = require("./routes/logout");
app.use('/logout', logout);
//提交新闻
var postnews = require("./routes/postNews");
app.use('/postnews', postnews);
//查询新闻
var loadnews = require("./routes/loadNews");
app.use('/loadnews', loadnews);
//删除新闻
var deletenews = require("./routes/deleteNews");
app.use('/deletenews', deletenews);
//街办信箱
var postAdvice = require("./routes/postAdvice");
app.use("/postAdvice", postAdvice);
//查看反馈
var loadAdvice = require("./routes/loadAdvice");
app.use("/loadAdvice", loadAdvice);
//错误日志存储
var saveError = require("./routes/saveError");
app.use("/saveError", saveError);


// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

//原注释说是会对错误进行加亮处理
//这部分和下面的区别在于，这部分会将错误信息暴露给用户，而下面的不会，因此注释掉这部分
//if (app.get('env') === 'development') {
//    app.use(function (err, req, res, next) {
//        res.status(err.status || 500);
//        res.render('error', {
//            message: err.message,
//            error: err
//        });
//    });
//}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});
console.log("Server start at :" + new Date());

module.exports = app;
