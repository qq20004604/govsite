<template>
    <div id="app" class="container">
        <div class="background-image container"></div>
        <main-top></main-top>
        <login-dialog v-if="state=='login'">12321</login-dialog>
        <post-news v-if="state=='already'"></post-news>
        <template v-if="state==''">
            <main-container></main-container>
            <main-foot></main-foot>
        </template>
    </div>
</template>
<script>
    import mainTop from './components/main-top.vue'
    import mainContainer from './components/main-container.vue'
    import mainFoot from './components/main-foot.vue'
    import login from './components/login.vue'
    import postNews from './components/post-news.vue'

    export default {
        data(){
            return {
                state: ""
            }
        },
        components: {
            'main-top': mainTop,
            'main-container': mainContainer,
            'main-foot': mainFoot,
            'login-dialog': login,
            'post-news': postNews
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
