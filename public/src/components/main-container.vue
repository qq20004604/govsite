<template>
    <div class="row main">
        <div class="col-md-12">
            <template v-if="announcement[0]">
                <h3 class="text-center main-announcement-title">【公告】{{announcement[0].title}}</h3>
                <p class="text-center">{{announcement[0].ctime|formatTime}}</p>
                <div class="main-announcement-text" @click="newsView(announcement[0].id)">
                    {{announcement[0].text}}
                </div>
            </template>
            <template v-else>
                <h3 class="text-center">【公告】加载中。。。</h3>
                <p class="text-center">0000-00-00 00:00:00</p>
                <div class="main-announcement-text">
                    加载中。。。
                </div>
            </template>
        </div>
        <div class="col-md-6 show-grid">
            <h3 class="text-center">公告</h3>
            <div class="list-group">
                <a href="#" class="list-group-item" v-if="index" :class="{'active':(index==1)&&i.id}"
                   v-for="(i,index) in announcement"
                   @click="newsView(i.id)">
                    <h4 class="list-group-item-heading">{{i.title}}</h4>
                    <p class="list-group-item-text too-long-text">
                        {{i.text}}</p>
                </a>

                <a href="#" class="list-group-item look-more" @click="viewNewsByType('公告')">
                    <h4 class="list-group-item-heading">查看更多...</h4>
                </a>
            </div>
        </div>
        <div class="col-md-6 show-grid">
            <h3 class="text-center">新闻</h3>
            <div class="list-group">
                <a href="#" class="list-group-item" :class="{'active':!index&&i.id}" v-for="(i,index) in news"
                   @click="newsView(i.id)">
                    <h4 class="list-group-item-heading">{{i.title}}</h4>
                    <p class="list-group-item-text too-long-text">
                        {{i.text}}</p>
                </a>

                <a href="#" class="list-group-item look-more" @click="viewNewsByType('新闻')">
                    <h4 class="list-group-item-heading">查看更多...</h4>
                </a>
            </div>
        </div>
        <div class="col-md-6 show-grid">
            <h3 class="text-center">知识</h3>
            <div class="list-group">
                <a href="#" class="list-group-item" :class="{'active':!index&&i.id}" v-for="(i,index) in knowledge"
                   @click="newsView(i.id)">
                    <h4 class="list-group-item-heading">{{i.title}}</h4>
                    <p class="list-group-item-text too-long-text">
                        {{i.text}}</p>
                </a>

                <a href="#" class="list-group-item look-more" @click="viewNewsByType('知识')">
                    <h4 class="list-group-item-heading">查看更多...</h4>
                </a>
            </div>
        </div>
        <div class="col-md-6 show-grid">
            <h3 class="text-center">其他</h3>
            <div class="list-group">
                <a href="#" class="list-group-item" :class="{'active':!index&&i.id}" v-for="(i,index) in knowledge"
                   @click="newsView(i.id)">
                    <h4 class="list-group-item-heading">{{i.title}}</h4>
                    <p class="list-group-item-text too-long-text">
                        {{i.text}}</p>
                </a>

                <a href="#" class="list-group-item look-more" @click="viewNewsByType('其他')">
                    <h4 class="list-group-item-heading">查看更多...</h4>
                </a>
            </div>
        </div>
    </div>
</template>

<style scoped>
    .row {
        margin-left: 0;
        margin-right: 0;
    }

    .main {
        background-color: white;
        border-radius-bottomleft: 5px !important;
        border-radius-bottomright: 5px !important;
    }

    .show-grid {
        border: 1px solid rgba(86, 61, 124, .2);
    }

    .too-long-text, .main-announcement-text {
        -ms-text-overflow: ellipsis;
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
        font-size: 12px;
        text-indent: 2em;
    }

    .main-announcement-title {
        color: black;
    }

    .main-announcement-text {
        font-size: 14px;
        height: 60px;
        white-space: normal;
        text-decoration: underline;
        cursor: pointer;
        color: #222;
        -webkit-tap-highlight-color: rgba(225, 225, 225, 0.5);
        margin-bottom: 20px;
    }

    .look-more {
        color: #999;
        background-color: #fcf8e3;
        text-align: center;
    }

    .look-more:hover {
        background-color: #fcf8e3;
    }

    .look-more h4 {
        margin: 0;
        font-size: 16px;
        font-weight: 500;
    }

</style>
<script>
    import Bus from '../event-bus.js'
    import GlobalSetting from '../global-setting.js'
    export default{
        data(){
            return {
                announcement: [],
                news: [],
                knowledge: [],
                others: []
            }
        },
        created: function () {
            var self = this;
            //精简再精简
            GlobalSetting.types.forEach(function (item) {
                self.load(item.area, item.value, item.name, item.isAnnouncement);
            })
        },
        methods: {
            load: function (area, type, name, isAnnouncement) {
                var self = this;
                //加载公告
                $.ajax({
                    url: "/loadnews",
                    type: "get",
                    dataType: "json",
                    data: {
                        area: area,
                        haveText: true,
                        type: type
                    },
                    cache: false
                }).done(function (result) {
//                    console.log(result);
                    if (result.code === 200) {
                        self[name] = result.data;
                    }
                    self.fullWithNews(self[name], type, isAnnouncement);
                });
            },
            //填充满格子（3格）
            fullWithNews: function (arr, str, isAnnouncement) {
                if (arr.length < (isAnnouncement ? 4 : 3)) {
                    arr.push({
                        title: "尚无" + str,
                        text: '空',
                        id: null
                    })
                    this.fullWithNews(arr, str, isAnnouncement);
                }
                return;
            },
            newsView: function (id) {
                if (id) {
                    Bus.$emit("setNewsId", id);
                }
            },
            viewNewsByType: function (type) {
                GlobalSetting.setScanNewsFilterType(type);
                this.$parent.state = 'scan';
            }
        },
        components: {}
    }
</script>
