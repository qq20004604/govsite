<template>
    <div class="col-md-12 main">
        <div class="btn-group btn-group-lg editnews">
            <button type="button" class="btn btn-primary" @click="setEditStatus('edit')">创建新闻</button>
            <button type="button" class="btn btn-danger" @click="setEditStatus('')">删除新闻</button>
        </div>
        <create-news v-if="editStatus=='edit'"></create-news>
        <delete-news v-else></delete-news>
    </div>
</template>
<style>
    .main {
        background-color: white;
        border-radius-bottomleft: 5px !important;
        border-radius-bottomright: 5px !important;
        -webkit-border-bottom-left-radius: 5px;
        -webkit-border-bottom-right-radius: 5px;
    }

    .editnews {
        margin: 20px 0;
    }

</style>
<script>
    import createNews from './create-news.vue'
    import deleteNews from './delete-news.vue'
    export default{
        data(){
            return {
                editStatus: 'edit'
            }
        },
        methods: {
            setEditStatus: function (str) {
                this.editStatus = str;
            }
        },
        components: {
            'create-news': createNews,
            'delete-news': deleteNews
        }
    }
</script>
