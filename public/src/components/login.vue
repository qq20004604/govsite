<template>
    <div class="col-md-12 main">
        <form role="form" class="form" v-if="state=='login'">
            <div class="form-group">
                <label>账号</label>
                <input type="text" class="form-control" v-model="account" placeholder="请输入账号">
            </div>
            <div class="form-group" :class="{'has-error':mes=='pwError'}">
                <label>密码</label>
                <input type="password" class="form-control" v-model="password" placeholder="密码" @keyup.enter="loginPost">
            </div>
            <div v-if="mes=='inputError'" class="alert alert-danger" role="alert">账号名或密码为空</div>
            <div v-if="mes=='accountError'" class="alert alert-danger" role="alert">用户名不存在</div>
            <div v-if="mes=='pwError'" class="alert alert-danger" role="alert">密码错误</div>
            <div v-if="mes=='serverError'" class="alert alert-danger" role="alert">服务器错误</div>
            <div v-if="mes=='logining'" class="alert alert-info" role="alert">登录中。。。</div>
            <div v-if="mes=='success'" class="alert alert-success" role="alert">登录成功，1秒后跳转</div>
            <div class="btn btn-primary" @click="loginPost">登录</div>
            <div class="btn btn-default" @click="backHomePage">返回首页</div>
        </form>
    </div>
</template>
<style scoped>
    .main {
        background-color: white;
        border-radius-bottomleft: 5px !important;
        border-radius-bottomright: 5px !important;
        -webkit-border-bottom-left-radius: 5px;
        -webkit-border-bottom-right-radius: 5px;
    }

     .form {
         margin: 20px 0;
    }

    .bg-danger, .bg-success {
        margin-bottom: 20px;
    }
</style>
<script>
    //  登录组件
    //  操作了父组件的state属性
    //  操作了根组件的user属性

    export default{
        data(){
            return {
                msg: 'hello vue',
                account: "",
                password: "",
                mes: '',
                state: this.$parent.state
            }
        },
        methods: {
            backHomePage: function () {
                this.$parent.state = "";
            },
            loginPost: function () {
                var self = this;
                function mes() {
                    setTimeout(function () {
                        self.mes = '';
                    }, 2000);
                }
                if (this.mes == 'logining') {
                    return;
                }
                if (this.account.length === 0 || this.password.length === 0) {
                    this.mes = 'inputError';
                    mes()
                    return;
                }
                var obj = {
                    username: this.account,
                    userpassword: this.password
                }
                this.mes = 'logining';
                $.ajax({
                    url: "/login",
                    type: "post",
                    dataType: "json",
                    data: obj
                }).done(function (result) {
                    console.log(result);
                    if (result.code === 200) {
                        //正常登录
                        self.$root.user = result.data.username;
                        self.mes = 'success';
                        self.password = "";
                        setTimeout(function () {
                            self.mes = '';
                            self.$parent.state = "already";
                        }, 1000);
                    } else if (result.code === 400) {
                        self.mes = 'pwError';    //密码错误
                        self.password = "";
                        mes()
                    } else if (result.code === 501) {
                        self.mes = 'accountError';    //账号错误
                        self.password = "";
                        mes()
                    } else {
                        self.mes = 'serverError';    //服务器错误
                        self.password = "";
                        mes()
                    }
                }).fail(function () {
                    self.mes = 'serverError';    //服务器错误
                    self.password = "";
                    mes()
                })
            }
        },
        components: {}
    }
</script>
