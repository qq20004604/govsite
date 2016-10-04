<template>
    <div class="row main">
        <div class="col-md-6 show-grid">
            <h3 class="text-center">公告</h3>
            <div class="list-group">
                <a href="#" class="list-group-item" :class="{'active':!index&&i.id}" v-for="(i,index) in announcement"
                   @click="newsView(i.id)">
                    <h4 class="list-group-item-heading">{{i.title}}</h4>
                    <p class="list-group-item-text too-long-text">
                        {{i.text}}</p>
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

    .too-long-text {
        -ms-text-overflow: ellipsis;
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
    }
</style>
<script>
    import Bus from '../event-bus.js'
    export default{
        data(){
            return {
                msg: 'hello vue',
                announcement: [],
                news: [],
            }
        },
        created: function () {
            this.loadNews();
        },
        methods: {
            loadNews: function () {
                var self = this;
                //加载公告
                $.ajax({
                    url: "/loadnews",
                    type: "get",
                    dataType: "json",
                    data: {
                        area: [0, 3],
                        haveText: true,
                        type: "公告"
                    },
                    cache: false
                }).done(function (result) {
                    console.log(result);
                    if (result.code === 501) {
                        self.error = 'noMoreNews';
                    } else if (result.code !== 200) {
                        self.error = 'error';
                    } else {
                        self.announcement = result.data;
                    }
                    self.fullWithNews(self.announcement, "公告");
                });

                //加载新闻
                $.ajax({
                    url: "/loadnews",
                    type: "get",
                    dataType: "json",
                    data: {
                        area: [0, 3],
                        haveText: true,
                        type: "新闻"
                    },
                    cache: false
                }).done(function (result) {
                    console.log(result);
                    if (result.code === 501) {
                        self.error = 'noMoreNews';
                    } else if (result.code !== 200) {
                        self.error = 'error';
                    } else {
                        self.news = result.data;
                    }
                    self.fullWithNews(self.news, "新闻");
                })
            },
            fullWithNews: function (arr, str) {
                if (arr.length < 3) {
                    arr.push({
                        title: "尚无" + str,
                        text: '空',
                        id: null
                    })
                    this.fullWithNews(arr, str);
                }
                return;
            },
            newsView: function (id) {
                if (id) {
                    Bus.$emit("setNewsId", id);
                }
            }
        },
        components: {}
    }
</script>
