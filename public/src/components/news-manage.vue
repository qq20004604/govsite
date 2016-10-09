<template>
    <div class="col-md-12 main">
        <div class="btn-group btn-group-lg editnews">
            <button type="button" class="btn btn-primary" @click="setEditStatus('edit')">创建新闻</button>
            <button type="button" class="btn btn-danger" @click="setEditStatus('')">删除新闻</button>
        </div>
        <news-create v-if="editStatus=='edit'"></news-create>
        <news-delete v-else></news-delete>
    </div>
</template>
<style scoped>
    .main {
        background-color: white;
        border-radius: 0 !important;
    }

    .editnews {
        margin: 20px 0;
    }

</style>
<script>
    import createNews from './news-create.vue'
    import deleteNews from './news-delete.vue'
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
            'news-create': createNews,
            'news-delete': deleteNews
        }
    }
</script>
