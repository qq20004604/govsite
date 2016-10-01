<template>
    <div class="background">
        <div class="row">
            <div class="col-md-12">
                <div v-if="error">
                    新闻加载失败
                    <button v-if="canRefresh" @click="refresh">点击刷新，重新加载</button>
                    <div v-else>刷新中……</div>
                </div>
                <ul v-else>
                    <template v-for="item in news">
                        <p>
                            <span>【{{item.type}}】</span>
                            <span class="text title">[{{item.title}}]</span>

                            <span class="float-right">删除新闻</span>
                        </p>
                    </template>
                </ul>
            </div>
        </div>
    </div>
</template>
<style scoped>
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
    //import HeaderComponent from './components/header.vue'
    //import OtherComponent from './components/other.vue'
    export default{
        data(){
            return {
                error: false,
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
                    console.log(result);
                    if (result.code !== 200) {
                        self.error = true;
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
            }
        },
        components: {
            //'other-component':OtherComponent,
            //HeaderComponent,
        }
    }
</script>
