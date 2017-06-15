/**
 * Created by hasee on 2017/6/12.
 */


(function (f) {

//选择器
    if (window.$ !== "undefined") {
        var $OBJECT = window.$;
    }
    window.$ = function (selector) {
        if (selector.charAt(0) === '#') {
            return document.querySelector(selector)
        } else {
            return document.querySelectorAll(selector);
        }
    }
    if ($OBJECT) {
        if (Object.assign) {
            Object.assign(window.$, $OBJECT)
        } else if (Object.setPrototypeOf) {
            Object.setPrototypeOf(window.$, $OBJECT);
        } else if (window.$.__proto__) {
            window.$.__proto__ = $OBJECT;
        } else {
            console.error("你的浏览器不支持实现$选择器的语法（这种可能性太低了……），很可能你也看不到这条log");
        }
    }
    var first = true;

    $("#connect-btn").addEventListener("click", function () {
        if (first) {
            f();
            first = false;
        }
    })
})(function () {
    // var serverURL = 'http://127.0.0.1:80';
    var serverURL = window.location.origin;

    //连接websocket后端服务器
    var socket = window.io.connect(serverURL);

    //监听事件
    listenEvent(socket);

    //设置点击事件
    clickEvent(socket);

    //初始化
    startEvent(socket);

});

//建立连接后的初始化
function startEvent(socket) {
    //延迟一秒拉倒，反正各种奇怪的问题……比如说初始化时更新姓名然后失败的
    //推断是因为在建立连接后可能还有点什么情况，我也不太确定。
    setTimeout(function () {
        //告诉服务器端有要更新名字了
        var name = getName();
        socket.emit('updateName', {
            name: name
        });
    }, 1000);

    $("#user-name").innerHTML = "无名氏";
}


//设置点击事件
function clickEvent(socket) {
    //点击按钮更新名字
    $("#updateName-btn").addEventListener("click", function () {
        //告诉服务器端有要更新名字了
        var name = getName();
        socket.emit('updateName', {
            name: name
        });
    })

    //创建新游戏
    $("#create-room").addEventListener("click", function () {
        socket.emit("createGame");
    })

    //点击进入某房间
    $("#enter-room").addEventListener("click", function () {
        var roomID = $("#room-id").value;
        roomID = roomID.replace(/[^0-9]/g, "");
        $("#room-id").value = roomID;
        socket.emit("userEnterGame", {
            gameID: roomID
        })
    })

    //发言
    $("#words-btn").addEventListener("click", function () {
        var text = $("#words").value;
        socket.emit("speakwords", {
            msg: text
        })
    })
}


//事件监听
function listenEvent(socket) {
    //监听新用户登录
    socket.on('alertToUser', function (msg) {
        var li = document.createElement("li");
        li.innerHTML = "系统消息：" + msg.msg;
        $("#chat-room").append(li);
    });

    //监听当前姓名
    socket.on("getCurrentName", function (msg) {
        $("#user-name").innerHTML = msg.name;
    })

    //警告信息
    socket.on("alertToRoom", function (msg) {
        var li = document.createElement("li");
        li.innerHTML = "系统消息：" + msg.msg;
        li.style.color = "red";
        $("#chat-room").append(li);
    })

    //离开房间时收到的信息
    socket.on("leaveGame", function (msg) {
        var li = document.createElement("li");
        li.innerHTML = "系统消息：" + msg.msg;
        li.style.color = "blue";
        $("#chat-room").append(li);
    })

    //获取房间ID
    socket.on("getRoomID", function (msg) {
        var gameID = msg.gameID;
        $("#room-info").innerHTML = gameID;
    })

    //聊天信息
    socket.on("chat-words", function (msg) {
        console.log(msg);
        var li = document.createElement("li");
        li.innerHTML = msg.msg;
        $("#chat-room").append(li);
    })

    //广播
    socket.on('broadcast', function (o) {
        console.log(o);
        $("#time").innerHTML = o;
    });

    //获取用户信息
    socket.on("userINFO", function (userINFO) {
        console.log(userINFO);
    })

}

// 生成随机姓名
function getName() {
    var familyNames = new Array(
        "赵", "钱", "孙", "李", "周", "吴", "郑", "王", "冯", "陈",
        "褚", "卫", "蒋", "沈", "韩", "杨", "朱", "秦", "尤", "许",
        "何", "吕", "施", "张", "孔", "曹", "严", "华", "金", "魏",
        "陶", "姜", "戚", "谢", "邹", "喻", "柏", "水", "窦", "章",
        "云", "苏", "潘", "葛", "奚", "范", "彭", "郎", "鲁", "韦",
        "昌", "马", "苗", "凤", "花", "方", "俞", "任", "袁", "柳",
        "酆", "鲍", "史", "唐", "费", "廉", "岑", "薛", "雷", "贺",
        "倪", "汤", "滕", "殷", "罗", "毕", "郝", "邬", "安", "常",
        "乐", "于", "时", "傅", "皮", "卞", "齐", "康", "伍", "余",
        "元", "卜", "顾", "孟", "平", "黄", "和", "穆", "萧", "尹"
    );
    var givenNames = new Array(
        "子璇", "淼", "国栋", "夫子", "瑞堂", "甜", "敏", "尚", "国贤", "贺祥", "晨涛",
        "昊轩", "易轩", "益辰", "益帆", "益冉", "瑾春", "瑾昆", "春齐", "杨", "文昊",
        "东东", "雄霖", "浩晨", "熙涵", "溶溶", "冰枫", "欣欣", "宜豪", "欣慧", "建政",
        "美欣", "淑慧", "文轩", "文杰", "欣源", "忠林", "榕润", "欣汝", "慧嘉", "新建",
        "建林", "亦菲", "林", "冰洁", "佳欣", "涵涵", "禹辰", "淳美", "泽惠", "伟洋",
        "涵越", "润丽", "翔", "淑华", "晶莹", "凌晶", "苒溪", "雨涵", "嘉怡", "佳毅",
        "子辰", "佳琪", "紫轩", "瑞辰", "昕蕊", "萌", "明远", "欣宜", "泽远", "欣怡",
        "佳怡", "佳惠", "晨茜", "晨璐", "运昊", "汝鑫", "淑君", "晶滢", "润莎", "榕汕",
        "佳钰", "佳玉", "晓庆", "一鸣", "语晨", "添池", "添昊", "雨泽", "雅晗", "雅涵",
        "清妍", "诗悦", "嘉乐", "晨涵", "天赫", "玥傲", "佳昊", "天昊", "萌萌", "若萌",
        "佳怡", "萌萌", "莹莹", "灵灵", "诺诺", "佳佳", "莎尔"
    );

    var i = parseInt(Math.random() * familyNames.length);
    if (i === familyNames.length) {
        i = familyNames.length - 1;
    }
    var familyName = familyNames[i];

    var j = parseInt(Math.random() * givenNames.length);
    if (j === givenNames.length) {
        j = givenNames.length - 1;
    }
    var givenName = givenNames[j];

    return familyName + givenName;
}