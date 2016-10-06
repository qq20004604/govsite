<template>
    <div class="background">
        <h2>
            街办信箱
        </h2>
        <form class="form-horizontal" role="form">
            <div class="form-group" :class="{'has-error':error.title, 'has-feedback':error.title}">
                <label for="advice-title" class="col-sm-1 control-label">标题</label>
                <div class="col-sm-10">
                    <input type="email" class="form-control"
                           id="advice-title" placeholder="请输入题目" v-model="title"/>
                </div>
            </div>
            <div class="form-group" :class="{'has-error':error.text, 'has-feedback':error.text}">
                <label for="advice-text" class="col-sm-1 control-label">内容</label>
                <div class="col-sm-10">
                    <textarea class="form-control" rows="15" id="advice-text" placeholder="内容不超过500字"
                              v-model="text"></textarea>
                </div>
            </div>
            <div class="form-group" :class="{'has-error':error.tel, 'has-feedback':error.tel}">
                <label for="advice-tel" class="col-sm-1 control-label">手机号码</label>
                <div class="col-sm-10">
                    <input class="form-control" rows="15" id="advice-tel" placeholder="请输入电话号码" v-model="tel"/>
                </div>
            </div>
            <div class="form-group">
                <div class="col-sm-offset-1 col-sm-10">
                    <p class="alert alert-danger" v-if="error.titleToLong && title.length>30">
                        题目太长了，不能超过30个字，当前字数{{title.length}}</p>
                    <p class="alert alert-danger" v-if="error.textToLong && text.length>500">
                        内容太长了，不能超过500个字，当前字数{{text.length}}</p>
                    <p class="alert alert-danger" v-if="error.telError">电话号码不正确</p>
                    <p class="alert alert-info" v-if="postAdviceState=='sumbitting'">提交中</p>
                    <p class="alert alert-info" v-if="postAdviceState=='error'">提交失败</p>
                    <p class="alert alert-success" v-if="postAdviceState=='already'">
                        提交完毕，你的案件编号是：{{adviceId}}，查询时可以通过这个编号来查询信箱反馈情况
                    </p>
                </div>
            </div>
            <div class="form-group">
                <div class="col-sm-offset-1 col-sm-10">
                    <div type="submit" class="btn btn-default" @click="postAdvice">提交</div>
                </div>
            </div>
        </form>
    </div>
</template>
<style scoped>
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
        padding: 20px 0 10px 40px;
    }

    textarea {
        resize: none;
    }

    .text-right {
        font-weight: 500;
        font-size: 16px;
        color: black;
    }
</style>
<script>
    //import HeaderComponent from './components/header.vue'
    //import OtherComponent from './components/other.vue'
    export default{
        data(){
            return {
                title: "",
                text: "",
                tel: "",
                error: {
                    title: false,
                    titleToLong: false,
                    text: false,
                    textToLong: false,
                    tel: false,
                    telError: false
                },
                postAdviceState: "",
                adviceId: "无"
            }
        },
        methods: {
            checkinput: function () {
                this.postAdviceState = '';
                var currentInput = true;
                this.error = {
                    title: false,
                    titleToLong: false,
                    text: false,
                    textToLong: false,
                    tel: false,
                    telError: false
                }
                if (this.title.length === 0) {
                    this.error.title = true;
                    currentInput = false;
                }
                if (this.title.length > 30) {
                    this.error.title = true;
                    this.error.titleToLong = true;
                    currentInput = false;
                }
                if (this.text.length === 0) {
                    this.error.text = true;
                    currentInput = false;
                }
                if (this.text.length > 500) {
                    this.error.text = true;
                    this.error.textToLong = true;
                    currentInput = false;
                }
                if (this.tel.length === 0) {
                    this.error.tel = true;
                    currentInput = false;
                }
                if (!/(\d{11})|^((\d{7,8})|(\d{4}|\d{3})-(\d{7,8})|(\d{4}|\d{3})-(\d{7,8})-(\d{4}|\d{3}|\d{2}|\d{1})|(\d{7,8})-(\d{4}|\d{3}|\d{2}|\d{1}))$/.test(this.tel)) {
                    this.error.telError = true;
                    this.error.tel = true;
                    currentInput = false;
                }
                return currentInput;
            },
            postAdvice: function () {
                var self = this;
                if (!this.checkinput()) {
                    return;
                }
                self.postAdviceState = 'sumbitting';
                $.ajax({
                    url: "/postAdvice",
                    type: "post",
                    dataType: "json",
                    data: {
                        title: self.title,
                        text: self.text,
                        tel: self.tel
                    }
                }).done(function (result) {
                    if (result.code === 200) {
                        self.postAdviceState = 'already';
                        self.adviceId = result.data;
                    } else {
                        self.postAdviceState = 'error';
                    }
                }).fail(function () {
                    self.postAdviceState = 'error';
                })
            }
        },
        components: {
            //'other-component':OtherComponent,
            //HeaderComponent,
        }
    }
</script>
