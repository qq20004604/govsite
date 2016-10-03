<template>
    <div id="app" class="container">
        <div class="background-image container"></div>
        <main-top></main-top>
        <!--新闻查看，页面之所以这样写，是为了方便在新闻隐藏后切换回原页面-->
        <news-view v-if="newsview"></news-view>
        <template v-else>
            <login-dialog v-if="state=='login'">12321</login-dialog>
            <manage-news v-if="state=='already'"></manage-news>
            <template v-if="state==''">
                <main-container></main-container>
                <main-foot></main-foot>
            </template>
        </template>
    </div>
</template>
<script>
    import mainTop from './components/main-top.vue'
    import mainContainer from './components/main-container.vue'
    import mainFoot from './components/main-foot.vue'
    import login from './components/login.vue'
    import manageNews from './components/manage-news.vue'
    import newsView from './components/news-view.vue'

    export default {
        data(){
            return {
                state: "",
                newsview: false
            }
        },
        components: {
            'main-top': mainTop,
            'main-container': mainContainer,
            'main-foot': mainFoot,
            'login-dialog': login,
            'manage-news': manageNews,
            'news-view': newsView
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
        background: url(http://www.lintong.gov.cn/images/c_bg.jpg) no-repeat;
        background-size: contain;
    }
</style>
