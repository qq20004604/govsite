<template>
    <div class="background">
        <div class="row main">
            <div class="col-md-12">
                <div class="page-title">文章浏览</div>
            </div>
            <div class="col-md-12">
                <div class="row">
                    <div class="col-md-4">
                        文章类型筛选：
                        <select v-model="Filter">
                            <option value="all">全部类型</option>
                            <option :value='item.value' v-for="item in types">{{item.value}}</option>
                        </select>
                    </div>
                </div>
            </div>
            <div class="col-md-12">
                <template v-if="error==''||error=='noMoreNews'" v-for="item in list">
                    <div class="row">
                        <div class="col-md-1 type">【{{item.type}}】</div>
                        <div class="col-md-9 text">
                            <span @click="newsView(item.id)">{{item.title}}</span>
                        </div>
                        <div class="col-md-2 text">
                            {{item.ctime|formatTime}}
                        </div>
                    </div>
                </template>
                <button v-if="canRefresh" class="btn btn-primary" @click="refresh">
                    <span v-if="list.length>0">点击加载更多内容</span>
                    <span v-else>点击重新加载内容</span>
                </button>
                <button v-else class="btn btn-warning">刷新中……</button>
                <div v-if="error=='error'" class="alert alert-danger">
                    新闻加载失败
                </div>
                <div v-if="error=='noMoreNews'" class="alert alert-warning">
                    没有更多内容了
                </div>
            </div>
        </div>
    </div>
</template>
<style scoped>
    .page-title {
        font-size: 32px;
        font-weight: 900;
        padding: 15px 0 20px 20px;
    }

    .main {
        margin: 0;
    }

    .row {
        margin-bottom: 10px;
    }

    .type {
        white-space: nowrap;
    }

    .btn {
        margin-top: 20px;
        margin-left: 20px;
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
    import GlobalSetting from '../global-setting.js'
    export default{
        data(){
            return {
                error: '',
                canRefresh: true,
                list: [],
                howMuchNewsOnceGet: 20,
                nowNewsCount: 0,
                types: GlobalSetting.types,
                Filter: "all"
            }
        },
        created: function () {
            var self = this;
            //如果能获取到类型（说明需要只显示指定类型的新闻），否则正常加载新闻
            var type = GlobalSetting.getScanNewsFilterType();
            if (type) {
                this.Filter = type;
                self.loadNews({
                    area: [0, self.howMuchNewsOnceGet],
                    haveText: false,
                    type: type
                }, true);
            } else {
                this.loadNews();
            }
            this.watchFilter();
        },
        methods: {
            loadNews: function (data, newAjax) {
                var self = this;
                $.ajax({
                    url: "/loadnews",
                    type: "get",
                    dataType: "json",
                    data: data ? data : {
                        area: [self.nowNewsCount, self.howMuchNewsOnceGet],
                        haveText: false
                    }
                }).done(function (result) {
//                    console.log(result);
                    if (result.code === 501) {
                        self.error = 'noMoreNews';
                        self.list = [];
                        setTimeout(function () {
                            if (self.error === 'noMoreNews' && self.list.length > 0) {
                                self.error = '';
                            }
                        }, 2000)
                        return;
                    } else if (result.code !== 200) {
                        self.error = 'error';
                        self.list = [];
                    } else {
                        self.error = '';
                        if (newAjax) {
                            self.nowNewsCount = result.data.length;
                            self.list = result.data;
                        } else {
                            self.list = self.list.concat(result.data);
                            self.nowNewsCount += result.data.length;
                        }
                    }
                })
            },
            refresh: function () {
                var self = this;
                if (!this.canRefresh) {
                    return;
                }
                this.canRefresh = false;
                this.$el.querySelector("button").blur();    //取消焦点，防止按钮处于上一个状态的焦点中带有一个蓝边
                setTimeout(function () {
                    self.canRefresh = true;
                }, 3000);

                //重新加载要从第0个开始加载，判断当前类型不是all的话，则需要加类型判断来加载
                var obj = {
                    area: [0, self.howMuchNewsOnceGet],
                    haveText: false
                };
                if (this.Filter !== 'all') {
                    obj.type = this.Filter;
                }
                this.loadNews(obj, true);
            },
            newsView: function (id) {
                Bus.$emit("setNewsId", id);
            },
            watchFilter: function () {
                var self = this;
                this.$watch('Filter', function (newVal, oldVal) {
                    if (newVal === 'all') {
                        self.loadNews({
                            area: [0, self.howMuchNewsOnceGet],
                            haveText: false
                        }, true);
                        return;
                    } else {
                        self.loadNews({
                            area: [0, self.howMuchNewsOnceGet],
                            haveText: false,
                            type: newVal
                        }, true);
                    }
                })
            }
        }
    }
</script>
