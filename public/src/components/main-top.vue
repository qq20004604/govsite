<template>
    <nav class="navbar navbar-default" role="navigation">
        <div class="container-fluid">
            <!-- Brand and toggle get grouped for better mobile display -->
            <div class="navbar-header">
                <button type="button" class="navbar-toggle collapsed" data-toggle="collapse"
                        data-target="#bs-example-navbar-collapse-1">
                    <span class="sr-only">这个是缩小后的按钮，下面三个span是三个横线</span>
                    <span class="icon-bar"></span>
                    <span class="icon-bar"></span>
                    <span class="icon-bar"></span>
                </button>
                <a class="navbar-brand" href="#">临潼区北田街道办事处</a>
            </div>

            <!-- Collect the nav links, forms, and other content for toggling -->
            <div class="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
                <ul class="nav navbar-nav">
                    <li class="active"><a href="#">首页</a></li>
                    <li><a href="#">新闻</a></li>
                    <li><a href="#">政策</a></li>
                    <li class="dropdown">
                        <a href="#" class="dropdown-toggle" data-toggle="dropdown">互动交流 <span class="caret"></span></a>
                        <ul class="dropdown-menu" role="menu">
                            <li><a href="#">街办信箱</a></li>
                            <li><a href="#">浏览反馈</a></li>
                            <!--<li class="divider"></li>分割线-->
                        </ul>
                    </li>
                    <li @click="changeNews">切换新闻</li>
                </ul>
                <ul class="nav navbar-nav navbar-right">
                    <p class="navbar-text text-alert">已访问人次：{{visitnumber}}</p>
                    <li><a href="#" @click="login" v-if="this.$parent.state!='already'">登录</a></li>
                    <li><a href="#" @click="logout" v-if="this.$parent.state=='already'">注销</a></li>
                    <li class="dropdown">
                        <a href="#" class="dropdown-toggle" data-toggle="dropdown">上级政府 <span class="caret"></span></a>
                        <ul class="dropdown-menu" role="menu">
                            <li>
                                <a href="http://www.gov.cn/" target="_blank">
                                    <img src="http://www.lintong.gov.cn/images/gh.jpg"/>中央人民政府网站</a>
                            </li>
                            <li>
                                <a href="http://www.shaanxi.gov.cn/" target="_blank"><img
                                        src="http://www.lintong.gov.cn/images/gh.jpg"/>陕西省人民政府网站</a>
                            </li>
                            <li>
                                <a href="http://www.xa.gov.cn/" target="_blank"><img
                                        src="http://www.lintong.gov.cn/images/gh.jpg"/>西安市人民政府网站</a>
                            </li>
                            <li>
                                <a href="http://www.lintong.gov.cn/" target="_blank"><img
                                        src="http://www.lintong.gov.cn/images/gh.jpg"/>临潼区人民政府网站</a>
                            </li>
                        </ul>
                    </li>
                </ul>
            </div><!-- /.navbar-collapse -->
        </div><!-- /.container-fluid -->
    </nav>
</template>
<style scoped>
    .dropdown-menu a img {
        margin-right: 10px
    }

    .navbar {
        margin-bottom: 0;
        border-radius-bottomleft: 0;
        border-radius-bottomright: 0;
        -webkit-border-bottom-left-radius: 0;
        -webkit-border-bottom-right-radius: 0;
        -moz-border-radius-bottomleft: 0;
        -moz-border-radius-bottomright: 0;
    }
</style>
<script>
    export default{
        data(){
            return {
                visitnumber: "读取中..."
            }
        },
        created: function () {
            this.load();
        },
        methods: {
            load: function () {
                var self = this;
                $.ajax({
                    url: "/getVisitsNumber",
                    type: "get",
                    dataType: "json"
                }).done(function (number) {
                    self.visitnumber = number.data;
                })
            },
            login: function () {
                this.$parent.state = "login";
            },
            logout: function () {
                this.$parent.state = '';

            },
            changeNews: function () {
                this.$parent.newsview = !this.$parent.newsview;
            }
        },
        components: {}
    }
</script>

