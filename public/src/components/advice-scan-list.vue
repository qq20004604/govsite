<template>
    <div class="row main">
        <div class="col-md-12">
            <div class="page-title">浏览反馈</div>
        </div>
        <div class="col-md-4">
            <div class="row">
                <div class="form-group" :class="{'has-error':search.idEmpty, 'has-feedback':search.idEmpty}">
                    <label class="col-md-3 control-label">查询编号</label>
                    <div class="col-md-9">
                        <input type="text" class="form-control" v-model="search.id"/>
                    </div>
                </div>
            </div>
        </div>
        <div class="col-md-4">
            <div class="row">
                <div class="form-group" :class="{'has-error':search.telEmpty, 'has-feedback':search.telEmpty}">
                    <label class="col-md-3 control-label">电话号码</label>
                    <div class="col-md-9">
                        <input type="text" class="form-control" v-model="search.tel"/>
                    </div>
                </div>
            </div>
        </div>
        <div class="col-md-4">
            <div class="btn-group">
                <button type="button" class="btn btn-primary search-btn" v-if="!search.isSearching"
                        @click="loadAdviceById">查 询
                </button>
                <button type="button" class="btn btn-info search-btn" v-if="search.isSearching">查询中</button>
                <button type="button" class="btn btn-warning search-btn" @click="clearSearchInput">清 空</button>
            </div>
        </div>
        <div class="col-md-12" v-if="search.error!==''">
            <div class="alert alert-warning" v-if="search.error=='errorid'">
                您输入的编号错误，没有查询到内容
            </div>
            <div class="alert alert-warning" v-if="search.error=='errortel'">
                您输入的电话号码错误
            </div>
        </div>
        <div class="col-md-12" v-if="app.haveLogined">
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
                    <div class="col-md-1 haveResponsed" v-if="item.mtime!='0'">【已解决】</div>
                    <div class="col-md-1 notResponsed" v-if="item.mtime=='0'">【未解决】</div>
                    <div class="col-md-9 text">
                        <span @click="newsView(item.id)">{{item.title}}</span>
                    </div>
                    <div class="col-md-2 text">
                        {{item.ctime|formatTime}}
                    </div>
                </div>
            </template>
            <div class="btn-list">
                <template v-if="!search.SearchingById">
                    <button v-if="canRefresh" class="btn btn-primary" @click="refresh">
                        <span v-if="advices.length>0">点击加载更多内容</span>
                        <span v-else>点击重新加载内容</span>
                    </button>
                    <button v-else class="btn btn-warning">刷新中……</button>
                </template>
                <div v-if="error=='error'" class="alert alert-danger">
                    新闻加载失败
                </div>
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

    .haveResponsed {
        white-space: nowrap;
        color: green;
    }

    .notResponsed {
        white-space: nowrap;
        color: red;
    }

    .btn-list {
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

    .form-group, .btn-group {
        height: 34px;
        line-height: 34px;
    }

    .search-btn {
        width: 80px;
        font-weight: 900;
    }
</style>
<script>
    import Bus from '../event-bus.js'
    export default{
        data(){
            return {
                advices: [],
                filter: 'all',
                error: '',
                canRefresh: true,
                app: Bus.getAppComponent(),
                nowNewsCount: 0,
                howMuchNewsOnceGet: 20,
                search: {
                    id: "",
                    tel: "",
                    error: "",
                    isSearching: false,
                    idEmpty: false,
                    telEmpty: false,
                    SearchingById: false
                }
            }
        },
        created: function () {
            this.loadNews();
            this.watchFilter();
        },
        methods: {
            loadNews: function (data, newAjax) {
                var self = this;
                var postData = null;
                if (data) {
                    postData = data;
                } else {
                    postData = {
                        area: [self.nowNewsCount, self.howMuchNewsOnceGet]
                    };
                    if (this.app.haveLogined) {
                        if (this.filter === 'notResponsed') {
                            postData.haveResponse = false;
                        } else if (this.filter === 'haveLogined') {
                            postData.haveResponse = true;
                        }
                    }
                }
//                console.log(postData);
                $.ajax({
                    url: "/loadAdvice",
                    type: "get",
                    dataType: "json",
                    data: postData
                }).done(function (result) {
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
                }).fail(function () {
                    self.error = 'error';
                    self.advices = [];
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
                var postData = {
                    area: [0, self.howMuchNewsOnceGet]
                };

                if (this.app.haveLogined) {
                    if (this.filter === 'notResponsed') {
                        postData.type = false;
                    } else if (this.filter === 'haveLogined') {
                        postData.type = true;
                    }
                }
                this.loadNews(postData, true);
            },
            newsView: function (id) {
                Bus.setScanAdviceId(id);
                Bus.$emit("setScanAdviceState", 'page');
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
                        var postData = {
                            area: [0, self.howMuchNewsOnceGet],
                            haveText: false
                        };
                        if (this.app.haveLogined) {
                            if (newVal === 'notResponsed') {
                                postData.haveResponse = false;
                            } else if (newVal === 'haveResponsed') {
                                postData.haveResponse = true;
                            }
                        }
                        self.loadNews(postData, true);
                    }
                })
            },
            //清除查询的输入框
            clearSearchInput: function () {
                this.search = {
                    id: "",
                    tel: "",
                    error: "",
                    isSearching: false,
                    idEmpty: false,
                    telEmpty: false,
                    SearchingById: false
                };
            },
            //根据输入框内容发起ajax请求
            loadAdviceById: function () {
                //先检测输入内容
                this.search.idEmpty = false;
                this.search.telEmpty = false;
                if (this.search.id.length === 0) {
                    this.search.idEmpty = true;
                }
                if (this.search.tel.length === 0 || this.search.tel.length > 12) {
                    this.search.telEmpty = true;
                }
                if (this.search.idEmpty || this.search.telEmpty) {
                    return;
                }
                //设置发送内容
                var postData = {
                    id: this.search.id,
                    tel: this.search.tel
                }
                this.search.isSearching = true;
                this.search.SearchingById = true;
                var self = this;
                //发起请求
                $.ajax({
                    url: "/loadAdvice",
                    type: "get",
                    dataType: "json",
                    data: postData
                }).done(function (result) {
                    console.log(result);
                    self.search.isSearching = false;
                    if (result.code === 501) {
                        self.search.error = 'errorid'
                        setTimeout(function () {
                            self.search.error = '';
                        }, 5000)
                        return;
                    } else if (result.code === 400) {
                        self.search.error = 'errortel';
                        setTimeout(function () {
                            self.search.error = '';
                        }, 5000)
                    } else if (result.code !== 200) {
                        self.error = 'error';
                        self.advices = [];
                    } else {
                        self.error = '';
                        self.search.error = '';
                        self.nowNewsCount = 0;
                        self.advices = result.data;
                    }
                }).fail(function () {
                    self.search.isSearching = false;
                    self.error = 'error';
                    self.advices = [];
                })
            }
        }
    }
</script>
