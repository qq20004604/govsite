<template>
    <div class="background">
        <div class="row">
            <span class="btn btn-primary backBtn" @click="backToLastPage">返回之前页面</span>
            <div v-if="id" class="col-md-12">
                <h2 class="text-center">
                    {{news.title}}
                </h2>
                <p class="text-center">{{news.ctime|formatTime}}</p>
                <div class="main-text">{{news.text}}</div>
            </div>
            <h1 v-else class="col-md-12 text-center">
                没有获取到任何新闻，请返回上一页
            </h1>
        </div>
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

    .main-text {
        padding: 10px 30px 20px 30px;
        white-space: pre-wrap;
    }

    .backBtn {
        margin-left: 40px;
    }

</style>
<script>
    import Bus from '../event-bus.js'
    export default{
        data(){
            return {
                id: null,
                news: null
            }
        },
        created: function () {
            var self = this;
            Bus.$on("setNewsId", function (id) {
                self.id = id;
                self.loadNews();
            })
        },
        methods: {
            loadNews: function () {
                var self = this;
                $.ajax({
                    url: "/loadnews",
                    type: "get",
                    dataType: "json",
                    data: {id: self.id}
                }).done(function (result) {
                    if (result.code === 200) {
                        self.news = result.data[0];
                    }
                })
            },
            backToLastPage: function () {
                Bus.$emit("setNewsShow", false);
            }
        },
        components: {
            //'other-component':OtherComponent,
            //HeaderComponent,
        }
    }
</script>
