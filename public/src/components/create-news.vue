<template>
    <div class="background">
        <div class="row">
            <div class="col-md-2" :class="{'has-error':mes=='selectError'}">
                <select class="form-control" v-model="type">
                    <option value='a'>1</option>
                    <option value=''>1</option>
                    <option value=''>1</option>
                </select>
            </div>
            <div class="col-md-10" :class="{'has-error':mes=='titleError'||mes=='titleToLong'}">
                <input type="text" class="form-control" placeholder="标题" maxlength="20" v-model="title">
            </div>
        </div>
        <div :class="{'has-error':mes=='textError'||mes=='textToLong'}">
            <textarea class="form-control" rows="30" v-model="text"></textarea>
        </div>
        <p>这里没有自动保存功能，因此请在其他地方写完后再复制过来</p>
        <div v-if="mes=='selectError'" class="alert alert-danger" role="alert">文章类型不能为空</div>
        <div v-if="mes=='titleError'" class="alert alert-danger" role="alert">标题不能为空</div>
        <div v-if="mes=='textError'" class="alert alert-danger" role="alert">正文不能为空</div>
        <div v-if="mes=='titleToLong'" class="alert alert-danger" role="alert">标题内容太长</div>
        <div v-if="mes=='textToLong'" class="alert alert-danger" role="alert">正文内容太长</div>
        <div v-if="mes=='serverError'" class="alert alert-danger" role="alert">服务器错误</div>
        <div v-if="mes=='not-allow'" class="alert alert-danger" role="alert">你没有登录，不允许提交新闻</div>
        <div v-if="mes=='posting'" class="alert alert-info" role="alert">提交中。。。</div>
        <div v-if="mes=='success'" class="alert alert-success" role="alert">提交成功，1秒后跳转</div>
        <div class="btn btn-primary" @click="loginPost">提交</div>
        <div class="btn btn-default" @click="emptyText">清空</div>
    </div>
</template>
<style scoped>
    .background {
        padding-bottom: 20px;
    }

    .row {
        margin-bottom: 20px;
    }

    p {
        margin-bottom: 20px;
    }

</style>
<script>
    export default{
        data(){
            return {
                msg: 'hello vue',
                title: '',
                text: '',
                type: "a",
                mes: ""
            }
        },
        methods: {
            loginPost: function () {
                var self = this;
                if (this.mes == 'posting') {
                    return;
                }
                function mes() {
                    setTimeout(function () {
                        self.mes = '';
                    }, 2000);
                }

                if (this.type.length === 0) {
                    this.mes = 'inputError';
                    mes();
                } else if (this.title.length === 0) {
                    this.mes = 'titleError';
                    mes();
                } else if (this.text.length === 0) {
                    this.mes = 'textError';
                    mes();
                } else if (this.title.length > 20) {
                    this.mes = 'titleToLong';
                    mes();
                } else if (this.text.length > 20) {
                    this.mes = 'textToLong';
                    mes();
                } else {
                    var obj = {
                        type: self.type,
                        title: self.title,
                        text: self.text,
                        editor: self.$root.user
                    }
                    this.mes = 'posting';
                    $.ajax({
                        url: "/postnews",
                        type: "post",
                        dataType: "json",
                        data: obj
                    }).done(function (result) {
                        if (result.code === 200) {
                            self.mes = 'success';
                            setTimeout(function () {
                                self.mes = '';
                                self.type = '';
                                self.title = '';
                                self.text = '';
                            }, 1000)
                        } else if (result.code === 500) {
                            self.mes = 'serverError';
                            mes();
                        } else if (result.code === 401) {
                            self.mes = 'not-allow';
                            mes();
                        } else {
                            self.mes = 'unknownError';
                            mes();
                        }
                    }).fail(function () {
                        self.mes = 'serverError';    //服务器错误
                        self.password = "";
                        mes()
                    })

                }
            },
            emptyText: function () {
                this.type = '';
                this.title = '';
                this.text = '';
            }
        }
    }
</script>
