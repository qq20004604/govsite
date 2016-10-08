#main.js

    user    //用于设置用户状态的，只有登录后才有值，获取方法是this.$root.user


#App.vue

状态变量 state

    ""    访客状态
    "login"    登录状态
    "already"    已经登录，此时$root.user有值
    

#Login.vue

提示变量 mes

    "inputError"    账号名或密码为空
    "accountError"    用户名不存在
    "pwError"    密码错误（此时密码输入框会变色）
    "serverError"    服务器错误
    "logining"    登录中（此时禁止再次发起登录请求）
    "success"    登录成功，1秒后跳转
    

