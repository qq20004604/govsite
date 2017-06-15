/**
 * Created by 王冬 on 2017/6/11.
 */
'use strict'
var express = require('express'); // 调用express模块
var router = express.Router();  // 调用模块的Router方法
var db = require('../models/db');   // 调用刚才封装好的user类
var fun = require("../models/fun"); //公共函数库

//标准数据是
/*
 {
 url : "",    //当前页面url
 error : ""   //错误信息
 }
 然后服务器生成ctime，插入到表errorLog中
 */

//错误处理，插入表中
router.post('/', function (req, res, next) {
    //没有错误数据
    if (!req.body.error) {
        return res.send({
            code: 401,
            data: "You are not allowed post advice to Server"
        });
    } else if (typeof req.body.error !== "string") {
        return res.send({
            code: 400,
            data: "Your postmessage is error."
        });
    }
    //"User-Agent"
    saveErrorToSQL({
            error: req.body.error,
            url: req.body.url,
            useragent: fun.getUserAgent(req, "User-Agent"),
            ip: fun.getIP()
        },
        function (err, result) {
            if (result) {   //有结果
                return res.send({
                    code: 200,
                    data: result.insertId  //只返回id
                });
            }
            if (err) {  //如果报错，返回报错信息
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

//错误信息存储函数
function saveErrorToSQL(data, callback) {
    var selectResult;
    db.con(function (connect) {
        connect.query("INSERT errorlog (ctime, url, errorMessage, useragent, ip) values(?, ?, ?, ?, ?)", [
                fun.getNowTime(),
                data.url,
                data.error,
                data.useragent,
                data.ip
            ],
            function (err, result) {
                if (err) {  //报错
                    console.log(error + " error information is: " + err);
                    return callback(err, null);
                }
                console.log(result);
                selectResult = result;  //这里的result是一个数组，只包含一个元素（或者是空）
                if (selectResult.insertId || selectResult.changedRows) {  //查询到的话，数组是有元素的（即length > 0）
                    return callback(null, selectResult) //这里的selectResult就是user对象，包含name和password属性
                } else {
                    return callback(null, null);    //如果查询不到，两个参数都为空
                }
            })
    })
}


module.exports = router;