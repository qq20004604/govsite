#NPM install browserify相关说明
需要已安装好npm管理器

    npm install -g vue-cli
    
    
如果提示某个module没有，那么删除node_modules这个文件夹，然后用npm install重新安装。

这里指的是browserify这个工具，nodejs是没有这个问题的，但nodejs需要4.x以上版本才可以。

#MYSQL table create

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




#main-top.vue    接口
url

    /getVisitsNumber
    
type

    GET

data

    {
        "data": 123
    }
    
    123是访问人数，类型是Number。
    当出错时，data的值是字符串"未能获取已访问人数"
  

#login.vue    接口
url

    /login
    
type

    POST
    
data

    发送
    {
        username: this.account,
        userpassword: this.password
    }
    
    返回
    见状态码
    
#create-news.vue    接口
url

    /postnews
    
type

    POST
    
data

    发送
    {
        type: self.type,
        title: self.title,
        text: self.text,
        editor: self.$root.user
    }
    
    返回
    见状态码
    
