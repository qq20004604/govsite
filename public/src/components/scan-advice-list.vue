<template>
    <div class="row main">
        <div class="col-md-12">
            <div class="page-title">浏览反馈</div>
        </div>
        <div class="col-md-12" v-if="haveLogined">
            <div class="row">
                <div class="col-md-4">
                    文章类型筛选：
                    <select v-model="filter">
                        <option value="all">全部类型</option>
                        <option value='haveResponsed'>已回复</option>
                        <option value='notResponsed'>未回复</option>
                    </select>
                </div>
            </div>
        </div>
        <div class="col-md-12">
            <template v-if="error==''||error=='noMoreNews'" v-for="item in advices">
                <div class="row">
                    <div class="col-md-1 type">【已解决】</div>
                    <div class="col-md-9 text">
                        <span @click="newsView(item.id)">{{item.title}}</span>
                    </div>
                    <div class="col-md-2 text">
                        {{item.ctime|formatTime}}
                    </div>
                </div>
            </template>
            <button v-if="canRefresh" class="btn btn-primary" @click="refresh">
                <span v-if="advices.length>0">点击加载更多内容</span>
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
        color: green;
    }

    .btn {
        margin-top: 20px;
        margin-left: 20px;
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

    import globalSetting from '../global-setting'

    export default{
        data(){
            return {
                advices: [],
                filter: 'all',
                error: '',
                canRefresh: true,
                haveLogined: this.app.haveLogined,
                nowNewsCount: 0,
                howMuchNewsOnceGet: 20,
                app: globalSetting.getAppComponent()
            }
        },
        created: function () {
            this.loadNews();
            this.watchFilter();
        },
        methods: {
            loadNews: function (data, newAjax) {
                var self = this;
                $.ajax({
                    url: "/loadAdvice",
                    type: "get",
                    dataType: "json",
                    data: data ? data : {
                        area: [self.nowNewsCount, self.howMuchNewsOnceGet]
                    }
                }).done(function (result) {
//                    console.log(result);
                    if (result.code === 501) {
                        self.error = 'noMoreNews';
                        self.advices = [];
                        setTimeout(function () {
                            if (self.error === 'noMoreNews' && self.advices.length > 0) {
                                self.error = '';
                            }
                        }, 2000)
                        return;
                    } else if (result.code !== 200) {
                        self.error = 'error';
                        self.advices = [];
                    } else {
                        self.error = '';
                        if (newAjax) {
                            self.nowNewsCount = result.data.length;
                            self.advices = result.data;
                        } else {
                            self.advices = self.advices.concat(result.data);
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
                    area: [0, self.howMuchNewsOnceGet]
                };
                if (this.filter !== 'all') {
                    obj.type = this.filter;
                }
                this.loadNews(obj, true);
            },
            newsView: function (id) {
                this.app.state = 'page';
                globalSetting.setScanAdviceId(id);
            },
            watchFilter: function () {
                var self = this;
                this.$watch('filter', function (newVal, oldVal) {
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
