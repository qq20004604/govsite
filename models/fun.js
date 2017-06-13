/**
 * Created by 王冬 on 2017/6/11.
 */
//一些公有函数
//下划线开头的是私有函数
'use strict'
//格式化时间
let formatDate = function (date) {
    return date.getFullYear() + "-" + addZero(date.getMonth() + 1, 2) + "-" + addZero(date.getDate(), 2) + " " +
        addZero(date.getHours(), 2) + ":" + addZero(date.getMinutes(), 2) + ":" + addZero(date.getSeconds(), 2);
}

//在字符串开始补足0
let addZero = function (str, length) {
    str = String(str);
    if (typeof str !== "string" || typeof length !== "number") {
        return str;
    }
    while (str.length < length) {
        str = "0" + str;
    }
    return str;
}

module.exports = {
    //获取当前时间
    getNowTime() {
        return formatDate(new Date());
    },
    //获取user-agent
    getUserAgent(req, key){
        if (Object.prototype.toString.call(req.rawHeaders) === "‌[object Array]") {
            return "";
        }
        var index = req.rawHeaders.indexOf(key);
        if (index !== -1) {
            return req.rawHeaders[index + 1];
        }
    },
    //获取ip
    getIP(req){

    }
}