<template>
    <div id="app" class="container">
        <div class="background-image container"></div>
        <main-top></main-top>
        <!--新闻查看，页面之所以这样写，是为了方便在新闻隐藏后切换回原页面-->
        <news-view v-show="newsview"></news-view>
        <div v-show="!newsview">
            <!--登录-->
            <login-page v-if="state=='login'"></login-page>
            <!--添加/删除新闻-->
            <news-manage v-if="state=='already'"></news-manage>
            <!--浏览-->
            <news-scan-list v-if="state=='scan'"></news-scan-list>
            <!--首页-->
            <main-container v-if="state==''"></main-container>
            <advice-post v-if="state=='advice'"></advice-post>
            <advice-scan v-if="state=='advice-list'"></advice-scan>
        </div>
        <main-foot></main-foot>
    </div>
</template>
<script>
    import Bus from './event-bus'
    import mainTop from './components/main-top.vue'
    import mainContainer from './components/main-container.vue'
    import mainFoot from './components/main-foot.vue'
    import login from './components/login.vue'
    import manageNews from './components/news-manage.vue'
    import newsView from './components/news-view.vue'
    import scanNewsList from './components/news-scan-list.vue'
    import advice from './components/advice-post.vue'
    import scanAdvice from './components/advice-scan.vue'

    export default {
        data(){
            return {
                state: "",
                newsview: false,
                haveLogined: false
            }
        },
        created: function () {
            var self = this;
            Bus.$on("setNewsId", function () {
                self.newsview = true;
            })
            Bus.$on("setNewsShow", function (bool) {
                self.newsview = bool;
            })
            Bus.setAppComponent(this);
        },
        components: {
            'main-top': mainTop,
            'main-container': mainContainer,
            'main-foot': mainFoot,
            'login-page': login,
            'news-manage': manageNews,
            'news-view': newsView,
            'news-scan-list': scanNewsList,
            'advice-post': advice,
            'advice-scan': scanAdvice
        }
    }
</script>

<style>
    body {
        font-family: Helvetica, sans-serif;
        color: #7e7e7e;
        background: #e61112;
    }

    .background-image {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: -1;
        background: url(/img/c_bg.png) no-repeat;
        background-size: contain;
    }

    #app {
        padding: 0;
    }
</style>
