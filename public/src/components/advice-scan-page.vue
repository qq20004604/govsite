<template>
    <div class="background">
        <h2>
            浏览反馈内容
        </h2>
        <div class="btn-group backBtn">
            <button type="button" class="btn btn-primary" @click="backToList">返回列表</button>
            <button type="button" class="btn btn-primary" style="margin-left:20px" @click="setCanEdit"
                    v-if="app.haveLogined && !editing">编辑回复内容
            </button>
            <button type="button" class="btn btn-info" style="margin-left:20px" @click="submit"
                    v-if="app.haveLogined && editing">提交回复内容
            </button>
        </div>
        <div class="row" v-if="postState!==''">
            <div class="col-md-12">
                <div class="alert alert-danger" v-if="postState=='error'">
                    提交失败
                </div>
                <div class="alert alert-success" v-if="postState=='success'">
                    提交成功
                </div>
            </div>
        </div>
        <form class="form-horizontal" role="form">
            <div class="form-group">
                <label class="col-sm-1 control-label">案件编号</label>
                <div class="col-sm-10">
                    <input type="text" class="form-control" v-model="advice.id" disabled/>
                </div>
            </div>
            <div class="form-group">
                <label class="col-sm-1 control-label">标题</label>
                <div class="col-sm-10">
                    <input type="text" class="form-control" v-model="advice.title" disabled/>
                </div>
            </div>
            <div class="form-group">
                <label class="col-sm-1 control-label">内容</label>
                <div class="col-sm-10">
                    <textarea class="form-control" rows="15" v-model="advice.text" disabled></textarea>
                </div>
            </div>
            <div class="form-group">
                <label class="col-sm-1 control-label">手机号码</label>
                <div class="col-sm-10">
                    <input type="text" class="form-control" v-model="advice.tel" disabled/>
                </div>
            </div>
            <div class="form-group">
                <label class="col-sm-1 control-label">创建时间</label>
                <div class="col-sm-10">
                    <input type="text" class="form-control" v-model="advice.ctime" disabled/>
                </div>
            </div>
            <div class="form-group">
                <label class="col-sm-1 control-label">回复时间</label>
                <div class="col-sm-10">
                    <input type="text" class="form-control" v-model="advice.mtime" disabled/>
                </div>
            </div>
            <div class="form-group">
                <label class="col-sm-1 control-label">回复内容</label>
                <div class="col-sm-10">
                    <textarea class="form-control" rows="15" v-model="advice.response" name="response"
                              disabled></textarea>
                </div>
            </div>
        </form>
    </div>
</template>
<style scoped>
    .row {
        margin-left: 0;
        margin-right: 0;
    }

    .background {
        padding-bottom: 20px;
        background-color: white;
        border-radius-bottomleft: 5px !important;
        border-radius-bottomright: 5px !important;
        -webkit-border-bottom-left-radius: 5px;
        -webkit-border-bottom-right-radius: 5px;
    }

    h2 {
        margin-top: 0;
        padding: 20px 0 0 40px;
    }

    .backBtn {
        margin: 10px 0 20px 40px;
    }
</style>
<script>
    import Bus from '../event-bus.js'
    export default{
        data(){
            return {
                advice: {
                    id: Bus.getScanAdviceId(),
                    title: "读取中",
                    text: "读取中",
                    tel: "读取中",
                    ctime: "读取中",
                    mtime: "读取中",
                    response: "读取中"
                },
                editing: false,
                app: Bus.getAppComponent(),
                postState: ""
            }
        },
        created: function () {
            this.setPage();
        },
        methods: {
            setPage: function () {
                var self = this;
                $.ajax({
                    url: "/loadAdvice",
                    type: "get",
                    dataType: "json",
                    data: {
                        id: self.advice.id
                    }
                }).done(function (result) {
                    if (result.code === 200) {
                        self.advice = result.data[0];
                        self.advice.ctime = new Date(Number(self.advice.ctime)).Format("yyyy-MM-dd hh:mm:ss");
                        if (self.advice.mtime == 0) {
                            self.advice.mtime = "未回复"
                        } else {
                            self.advice.mtime = new Date(Number(self.advice.mtime)).Format("yyyy-MM-dd hh:mm:ss");
                        }
                    } else {

                    }
                }).fail(function () {

                })
            },
            backToList: function () {
                Bus.$emit("setScanAdviceState", "list");
            },
            setCanEdit: function () {
                this.postState = '';
                var node = this.$el.querySelector('textarea[name=response]');
                node.disabled = false;
                this.editing = true;
            },

            submit: function () {
                var self = this;
                var node = this.$el.querySelector('textarea[name=response]');
                node.disabled = true;
                this.editing = false;
                console.log({
                    id: self.advice.id,
                    response: self.advice.text
                })
                $.ajax({
                    url: "/postAdvice",
                    type: "post",
                    dataType: "json",
                    data: {
                        id: self.advice.id,
                        response: self.advice.response
                    }
                }).done(function (result) {
                    console.log(result);
                    if (result.code === 200) {
                        self.postState = 'success';
                        self.advice.mtime = "已回复"
                    } else {
                        self.postState = 'error';
                    }
                }).fail(function () {
                    self.postState = 'error';
                })
            }
        }
    }
</script>
