<template>
    <div class="background">
        <div class="row">
            <div class="col-md-12">
                <button v-if="canRefresh" class="btn btn-primary" @click="refresh">
                    <span v-if="list.length>0">点击加载更多内容</span>
                    <span v-else>点击重新加载内容</span>
                </button>
                <button v-else class="btn btn-warning">刷新中……</button>
                <div v-if="error=='error'" class="alert alert-danger">
                    新闻加载失败
                </div>
                <ul v-if="error==''||error=='noMoreNews'">
                    <template v-for="item in list">
                        <div class="row">
                            <div class="col-md-1 type">【{{item.type}}】</div>
                            <div class="col-md-9 text" @click="newsView(item.id)">
                                {{item.title}}
                            </div>
                            <div class="col-md-2 text">
                                {{item.ctime|formatTime}}
                            </div>
                        </div>
                    </template>
                </ul>
                <div v-if="error=='noMoreNews'" class="alert alert-warning">
                    没有更多内容了
                </div>
            </div>
        </div>
    </div>
</template>
<style scoped>
    ul {
        margin-top: 20px;
    }

    .row {
        margin-bottom: 10px;
    }

    .type {
        white-space: nowrap;
    }

    .btn {
        margin-top: 20px;
        margin-left: 40px;
    }

    .background {
        padding-bottom: 20px;
        background-color: white;
        border-radius-bottomleft: 5px !important;
        border-radius-bottomright: 5px !important;
        -webkit-border-bottom-left-radius: 5px;
        -webkit-border-bottom-right-radius: 5px;
    }

    .text {
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
    }

    .text:nth-child(2) {
        text-decoration: underline;
        cursor: pointer;
    }

</style>
<script>
    import Bus from '../event-bus.js'
    export default{
        data(){
            return {
                error: '',
                canRefresh: true,
                list: [],
                howMuchNewsOnceGet: 20,
                nowNewsCount: 0
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
                    dataType: "json",
                    data: {
                        area: [self.nowNewsCount, self.howMuchNewsOnceGet],
                        haveText: false
                    }
                }).done(function (result) {
                    console.log(result);
                    if (result.code === 501) {
                        self.error = 'noMoreNews';
                        setTimeout(function () {
                            if (self.error === 'noMoreNews' && self.list.length > 0) {
                                self.error = '';
                            }
                        }, 2000)
                        return;
                    } else if (result.code !== 200) {
                        self.error = 'error';
                    } else {
                        self.list = self.list.concat(result.data);
                        self.nowNewsCount += result.data.length;
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
            newsView: function (id) {
                Bus.$emit("setNewsId", id);
            }
        }
    }
</script>
