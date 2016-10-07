##结构说明

外层是nodejs，使用express4.x，作为服务器，可以输入npm start来启动服务。这样的话就可以通过127.0.0.1来访问页面（使用的是80端口，如果需要修改的话，修改/bin/www文件）。

内层（public文件夹下）是Vue.js2.0。使用vue-cli（https://github.com/vuejs/vue-cli ），以及browserify（https://github.com/vuejs-templates/browserify ）。因此如果按我说明的没有正常运行，可以去查看这2个项目的github页面的说明。也使用的npm管理器进行管理。

##安装说明

全局安装vue-cli

    npm install -g vue-cli

然后在根目录下和public文件夹下，分别输入

    npm start
    
应该就ok了。
    
如果提示某个module没有，那么删除node_modules这个文件夹，然后用npm install重新安装。

会发生这个问题的原因是因为browserify这个工具，nodejs是没有这个问题的，但nodejs需要4.x以上版本才可以。

##启动说明

window下，启动根目录下的start.bat，可以启动Nodejs服务器。

启动public文件夹下的run.bat，可以启动browserify的调试服务，支持热加载和自建服务器（即不需要启动nodejs下的也可以，但是这种没办法支持ajax交互）。

如果要修改Vue.js的项目的话，请参考browserify的命令（npm run build）


##MYSQL table create 创建mysql的表

    CREATE DATABASE `govsite`;
    
    use govsite;
    
    CREATE TABLE `manager` (
      `Id` int(11) NOT NULL AUTO_INCREMENT,
      `username` varchar(20) NOT NULL DEFAULT 'noname',
      `userpassword` varchar(20) NOT NULL DEFAULT 'nopassword',
      PRIMARY KEY (`Id`)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8;
    
    CREATE TABLE `visitsrecord` (
      `Id` int(11) NOT NULL AUTO_INCREMENT,
      `ip` varchar(40) DEFAULT NULL,
      `ctime` bigint(20) DEFAULT NULL,
      `url` varchar(255) DEFAULT NULL,
      PRIMARY KEY (`Id`)
    ) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8;

    CREATE TABLE `news` (
      `Id` int(11) NOT NULL AUTO_INCREMENT,
      `editor` varchar(20) DEFAULT NULL,
      `ctime` bigint(20) DEFAULT NULL,
      `title` varchar(40) DEFAULT NULL,
      `text` text,
      `type` varchar(20) DEFAULT NULL,
      PRIMARY KEY (`Id`)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8;

    CREATE TABLE `advice` (
      `id` int(11) NOT NULL AUTO_INCREMENT,
      `ctime` bigint(20) NOT NULL DEFAULT '0',
      `title` varchar(60) NOT NULL DEFAULT '',
      `text` text,
      `tel` bigint(20) DEFAULT '0',
      `response` text,
      `mtime` bigint(20) NOT NULL DEFAULT '0',
      PRIMARY KEY (`id`)
    ) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;



注：前面没注意，id用的是Id，advice这张表开始改为id，之前的懒得改了。

