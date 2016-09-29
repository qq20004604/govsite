var db = require('./db')

function User(user) {       // 这是一个User类，传递的参数是一个对象，这个对象可以具有两个属性，分别是name和password
    this.name = user.name;  // 如果传递的user不是空，那么将其赋值给User类的实例的name属性
    this.password = user.password;  // 同上，赋给password属性
}

// 这个是查询方法
User.prototype.get = function (callback) {
    var self = this;
    if (this.name.length == 0) {    //如果在没账号/密码的情况下就调用插入方法，则提示错误并返回
        console.log("You can't select user information without NAME!");
        return callback("You can't select user information without NAME!");
    }
    var selectResult;
    db.con(function (connect) {
        connect.query('SELECT * FROM manager WHERE username = ?', [self.name], function (err, result) {
            if (err) {  //报错
                console.log("select name:" + self.name + " error, the err information is " + err);
                return callback("error");
            }
            //注意，这里返回的是带账号和密码的，另外，理论上是有可能有多个元素的，但由于在注册时，用户名限制了重复，因此只会返回一个
            selectResult = result;  //这里的result是一个数组，只包含一个元素（或者是空）
            if (selectResult.length) {  //查询到的话，数组是有元素的（即length > 0）
                return callback(null, selectResult[0]) //这里的selectResult就是user对象，包含name和password属性
            } else {
                return callback(null, null);    //如果查询不到，两个参数都为空
            }
        })
    })
}

module.exports = User;


