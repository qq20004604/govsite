<template>
    <div class="background">
        <h2>
            街办信箱
        </h2>
        <div class="btn-group backBtn">
            <button type="button" class="btn btn-primary" @click="">返回列表</button>
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
                    <textarea class="form-control" rows="15" v-model="advice.text" disabled></textarea>
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
                    id: this.$parent.id,
                    title: "读取中",
                    text: "读取中",
                    tel: "读取中",
                    ctime: "读取中",
                    mtime: "读取中",
                    response: "读取中"
                }
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
                        self.advice.mtime = new Date(Number(self.advice.mtime)).Format("yyyy-MM-dd hh:mm:ss");
                    } else {

                    }
                }).fail(function () {

                })
            }
        },
        components: {
            //'other-component':OtherComponent,
            //HeaderComponent,
        }
    }
</script>
