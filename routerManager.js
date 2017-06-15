/**
 * Created by 王冬 on 2017/6/13.
 * 路由管理文件
 */
module.exports = function (app) {
    //记录访问情况
    var Visits = require("./routes/visit");
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
}