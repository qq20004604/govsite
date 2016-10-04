<template>
    <div class="background">
        <div class="row">
            <div class="col-md-12">
                <button v-if="canRefresh" @click="refresh">点击刷新，重新加载</button>
                <div v-else>刷新中……</div>
                <div v-if="error=='error'" class="alert alert-danger">
                    新闻加载失败
                </div>
                <div v-if="error=='noMoreNews'" class="alert alert-info">
                    没有更多新闻了
                </div>
                <ul v-if="error==''">
                    <template v-for="item in news">
                        <p>
                            <span class="type">【{{item.type}}】</span>
                            <a class="text title" @click="newsView(item.id)" href="#">{{item.title}}</a>
                            <span class="float-right" @click="deleteNews(item.id)">删除新闻</span>
                        </p>
                    </template>
                </ul>
            </div>
        </div>
    </div>
</template>
<style scoped>
    ul {
        padding: 0;
    }

    .type {
        white-space: nowrap;
    }

    .background {
        padding-bottom: 20px;
    }

    .float-right {
        float: right;
        color: blue;
        cursor: pointer;
    }

    .float-right:hover {
        color: darkcyan;
        outline: 1px solid grey;
        outline-offset: 3px;
    }

    .text {
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
    }

    .title {
        width: 60%;
    }

</style>
<script>
    import Bus from '../event-bus.js'
    export default{
        data(){
            return {
                error: '',
                canRefresh: true,
                news: []
            }
        },
        created: function () {
            this.loadNews();
        },
        methods: {
            loadNews: function () {
                var self = this;
                $.ajax({
                    url: "/loadnews",
                    type: "get",
                    dataType: "json"
                }).done(function (result) {
                    if (result.code === 501) {
                        self.error = 'noMoreNews';
                        return;
                    } else if (result.code !== 200) {
                        self.error = 'error';
                    } else {
                        self.news = result.data;
                    }
                })
            },
            refresh: function () {
                var self = this;
                if (!this.canRefresh) {
                    return;
                }
                this.canRefresh = false;
                setTimeout(function () {
                    self.canRefresh = true;
                }, 3000);
                this.loadNews();
            },
            deleteNews: function (id) {
                var self = this;
                $.ajax({
                    url: "/deletenews",
                    type: "delete",
                    dataType: "json",
                    data: {id: id}
                }).done(function (result) {
                    if (result.code === 200) {
                        var id = parseInt(result.data);
                        self.news.forEach(function (item, index) {
                            if (item.id == id) {
                                self.news.splice(index, 1);
                            }
                        })
                        if (self.news.length === 0) {
                            self.refresh();
                        }
                    }
                })
            },
            newsView: function (id) {
                console.log(id);
                Bus.$emit("setNewsId", id);
            }
        },
        components: {
            //'other-component':OtherComponent,
            //HeaderComponent,
        }
    }
</script>
