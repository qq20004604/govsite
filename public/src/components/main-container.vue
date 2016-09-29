<template>
    <div class="row main">
        <div class="col-md-6 show-grid">
            <h3 class="text-center">公告</h3>
            <div class="list-group">
                <a href="#" class="list-group-item" :class="{'active':!index}" v-for="(i,index) in announcement">
                    <h4 class="list-group-item-heading">{{i.title}}</h4>
                    <p class="list-group-item-text too-long-text">
                        {{i.text}}</p>
                </a>
            </div>
        </div>
        <div class="col-md-6 show-grid">
            <h3 class="text-center">工作简报</h3>
        </div>
    </div>
</template>
<style scoped>
    .row {
        margin-left: 0;
        margin-right: 0;
    }

    .main {
        background-color: white;
        border-radius-bottomleft: 5px !important;
        border-radius-bottomright: 5px !important;
    }

    .show-grid {
        border: 1px solid rgba(86, 61, 124, .2);
    }

    .too-long-text {
        -ms-text-overflow: ellipsis;
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
    }
</style>
<script>
    //    import HeaderComponent from './components/header.vue'
    //    import OtherComponent from './components/other.vue'
    export default{
        data(){
            return {
                msg: 'hello vue',
                announcement: [
                    {
                        title: "abc",
                        description: "aaa"
                    },
                    {
                        title: "ddd",
                        description: "bbb"
                    },
                    {
                        title: "were",
                        description: "ccc"
                    }
                ]
            }
        },
        created: function () {
            this.loadNews();
        },
        methods: {
            loadNews: function () {
                $.ajax({
                    url: "/loadnews",
                    type: "get",
                    dataType: "json",
                    data: {type: "123"}
                }).done(function (result) {
                    console.log(result);
                })
            }
        },
        components: {}
    }
</script>
