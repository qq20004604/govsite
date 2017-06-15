/**
 * Created by 王冬 on 2017/6/10.
 */
var login = require("./login");
var disconnect = require("./disconnect");
var message = require("./message");
var createGame = require("./createGame");
var fun = require("../models/fun");

var configInfo = {
    "watcher": "观战者",
    "black": "黑方",
    "white": "白方"
}

module.exports = function (http) {
    var io = require('socket.io')(http);

    //在线用户
    //userSocket -> null或者{}
    /** value为对象时如下：
     *  {
     *      id:gameID,    //游戏ID
     *      role:"black"    //角色，black或者white或者watcher
     *  }
     */
    var onlineUsers = new Map();
    //游戏列表，内部的key是
    //gameID -> {gameInfo}
    var gameList = new GameList(onlineUsers);


    io.on('connection', function (socket) {
        var userID = socket.id;
        var userINFO = {
            id: userID,
            name: '无名氏'
        }
        onlineUsers.set(socket, null);
        console.log("新用户进入，当前在线用户：" + onlineUsers.size + "人");
        socket.userINFO = userINFO;

        //创建棋局，并加入游戏
        socket.on("createGame", function () {
            var roomID = gameList.createGame();
            gameList.userEnterGame(roomID, socket, null, function (gameID) {
                socket.emit("getRoomID", {
                    gameID
                })
            });
        })

        //监听用户更新名字
        socket.on('updateName', function (msg) {
            socket.userINFO.name = msg.name;
            //告诉用户更名成功
            socket.emit("getCurrentName", {
                name: msg.name
            })
        });

        //用户离开房间
        socket.on("leaveRoom", function (msg) {
            gameList.clearPlayer(socket);
        })

        //用户进入某个房间
        socket.on("userEnterGame", function (msg) {
            var room = msg.gameID;
            gameList.userEnterGame(room, socket, null, function (gameID) {
                socket.emit("getRoomID", {
                    gameID
                })
            });
        })

        //监听用户退出
        socket.on('disconnect', function (msg) {
            gameList.clearPlayer(socket);
            onlineUsers.delete(socket);
            console.log("用户退出，剩余在线用户：" + onlineUsers.size + "人");
            disconnect(msg, {});
        });

        //监听用户发布聊天内容
        socket.on('speakwords', function (msg) {
            //拼接说话，格式为：【某某人：说的话】
            var words = socket.userINFO.name + "：" + msg.msg;
            console.log(words);
            gameList.forEachUserSocketInGame(socket, function (member, role) {
                member.emit("chat-words", {
                    msg: words
                })
            })
        });

    });

    //定时器
    setInterval(function () {
        var msg = "当前时间为：" + fun.getNowTime();
        if (msg.charAt(msg.length - 1) === '0') {
            var number = gameList.clearAllEmptyGame();
            if (number > 0) {
                msg += "。本次已清空房间" + number + "个";
            }
        }
        msg += "，当前开启中的房间共计" + gameList.countGameRooms() + "个。";
        io.emit("broadcast", msg);
    }, 1000)

}

//游戏列表
function GameList(onlineUsers) {
    //游戏列表是一个Map结构
    //key是该局游戏的ID，value是一个对象，存储信息
    this.gamelist = new Map();
    //在线用户也是一个Map结构
    this.onlineUsers = onlineUsers;
}

//创建游戏（空的游戏），返回创建的游戏的ID
GameList.prototype.createGame = function (userSocket) {
    var isInGame = this.onlineUsers.get(userSocket);
    if (isInGame) {
        userSocket.emit("alertToUser", {
            msg: "你已经在游戏里了，不能创建游戏！"
        });
        return;
    }

    //创建游戏，给予唯一ID，防止其重复
    var gameID = parseInt(Math.random() * 100000);
    while (this.gamelist.has(gameID)) {
        gameID = parseInt(Math.random() * 100000);
    }
    gameID = String(gameID);
    //将房间ID加入到map结构中
    this.gamelist.set(gameID, {
        player: {   //玩家，值为其socket
            black: null,  //创建游戏者默认为黑棋方，直接添加进去
            white: null     //另一方设置为空
        },
        watcher: new Set(),        //观战者，将其socket存放其中
        ctime: (new Date()).getTime(),  //游戏创建时间，单位为秒
        size: 19,    //棋盘大小
        // 下棋的每一步都存在这里，索引为0的地方，是棋盘(1, 1)的位置；
        // html标签的索引值let index = info.steps[info.steps.length - 1] + 1;
        steps: [],
        gameover: false,     //游戏结束标志
        gameID: gameID      //游戏房间ID
    });

    //返回游戏ID
    return gameID;
}

//用户加入房间
GameList.prototype.userEnterGame = function (gameID, userSocket, role, callback) {
    //拉取到用户当前信息
    var currentGame = this.onlineUsers.get(userSocket);
    //有则调用【退出游戏房间】相关逻辑
    if (currentGame) {
        this.clearPlayer(userSocket);
    }

    //从gameID查该游戏
    var game = this.gamelist.get(gameID);
    if (!game) {
        userSocket.emit("alertToUser", {
            msg: "该房间不存在"
        });
        return;
    }
    //如果有角色，则按角色来
    if (role && role !== 'watcher') {
        if (game.player[role]) {
            userSocket.emit("alertToUser", {
                msg: "该位置有用户存在"
            });
            return;
        } else {
            game.player[role] = userSocket;
        }
    } else {
        role = 'watcher';
        //不然添加到观战者
        game.watcher.add(userSocket);
    }

    //更新当前用户所在房间的信息
    this.onlineUsers.set(userSocket, {
        id: gameID,    //游戏ID
        role: role    //角色，black或者white或者watcher
    })

    //通报所有本房间用户，有玩家加入到游戏中
    this.forEachUserSocketInGame(game, function (member, role) {
        //这里是每个用户的socket
        member.emit("alertToRoom", {
            //这里是当前加入的用户userSocket
            msg: userSocket.userINFO.name + " 加入到房间" + gameID + "中，角色为：" + configInfo[role]
        })
    })
    callback(gameID);
}

//清除空的游戏房间，返回清除掉的游戏房间的数目
GameList.prototype.clearAllEmptyGame = function () {
    var clearNumber = 0;

    this.gamelist.forEach((value, key, gamelist) => {
            var isEmpty = true;
            //其中一个位置有人就算有
            if (value.player.white || value.player.black || value.watcher.size) {
                isEmpty = false;
            }
            if (isEmpty) {
                gamelist.delete(key);
                clearNumber++;
            }
        }
    )
    return clearNumber;
}

//获取当前开启的房间数
GameList.prototype.countGameRooms = function () {
    return this.gamelist.size;
}

//用户退出游戏房间，清空该用户所在游戏房间的数据
GameList.prototype.clearPlayer = function (userSocket, isUserLeave) {
    //参数二为true表示是该用户主动退出游戏的
    var {role, room, gameID} = this.getTheGameOfThisUserInIt(userSocket);

    //如果game存在才继续，否则没必要继续
    if (room) {
        //先拉取游戏ID和在该游戏中的角色
        //如果是观战，则清除
        if (role === 'watcher') {
            room.watcher.delete(userSocket);
        } else {
            //如果是玩家，则重置为空
            room.player[role] = null;
        }
        if (isUserLeave) {
            //对其发出通告，告知其已经离开游戏
            userSocket.emit("leaveGame", {
                msg: "你已离开游戏",
                gameID: gameID
            });
        }
        console.log(role);
        this.forEachUserSocketInGame(userSocket, function (member) {
            member.emit("alertToRoom", {
                msg: userSocket.userINFO.name + "离开了房间，他的角色是：" + configInfo[role]
            })
        })
        //更新在线用户里，该用户所在的信息
        this.onlineUsers.set(userSocket, null);
        return true;
    } else {
        return false;
    }
}

//通过用户(socket)，返回该用户当前所在的游戏room，他在其中的角色，以及游戏房间ID
GameList.prototype.getTheGameOfThisUserInIt = function (userSocket) {
    var userInfoInGame = this.onlineUsers.get(userSocket);
    if (!userInfoInGame) {
        return {
            room: undefined,
            role: undefined,
            gameID: undefined
        };
    }
    var gameID = userInfoInGame.id;
    var role = userInfoInGame.role;
    //拉取到该游戏
    var gameInfo = this.gamelist.get(gameID);
    return {
        room: gameInfo,
        role: role,
        gameID: gameID
    };
}

//向房间内所有人通报信息，只适合发不带参数的信息
GameList.prototype.alertToRoom = function (game/*房间ID或者直接就是房间game*/, msg) {
    if (typeof game === 'number') {
        game = this.gamelist.get(game);
    }
    this.forEachUserSocketInGame(game, function (userSocket, role) {
        userSocket.emit("alertToRoom", {
            msg: msg
        })
    })
}

//通过game，遍历每个存在的userSocket，然后执行callback
GameList.prototype.forEachUserSocketInGame = function (base/*房间game，或者用户socket*/, callback) {
    //如果能拉取到userINFO，说明传的是socket，那么要通过这个去找game
    if (base.userINFO) {
        var {room} = this.getTheGameOfThisUserInIt(base);
        base = room;
    }

    if (base.player.black) {
        callback(base.player.black, "black");
    }
    if (base.player.white) {
        callback(base.player.black, "white");
    }
    base.watcher.forEach(function (userSocket) {
        callback(userSocket, "watcher");
    })
}


//通告某房间内所有用户msg信息
GameList.prototype.tellAllOfOneGame = function (gameID, msg) {

}


//
GameList.prototype.tellAllWhenUserEnterGame = function (socket, role) {
    var gameID = this.get(socket);
    var game = this.get(gameID);
    if (game.player.black) {
        game.player.black.emit("enterGame", {
            msg: "你已经加入游戏！角色为：" + configInfo[role],
            role: role
        })
    }
    if (game.player.white) {
        game.player.white.emit("enterGame", {
            msg: "你已经加入游戏！角色为：" + configInfo[role],
            role: role
        })
    }

}


//通过游戏ID，返回该游戏房间信息
GameList.prototype.getGameInfoByGameID = function (gameID) {
    //如果是游戏id
    return this.gamelist.get(gameID);
}

