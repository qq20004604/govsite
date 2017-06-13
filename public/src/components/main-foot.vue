<template>
    <footer class="foot">
        <h4 class="text-center">{{msg}}</h4>
        <h4 class="text-center">联系电话：XXXX</h4>
    </footer>
</template>
<style scoped>
    .foot {
        padding-top: 20px;
        padding-bottom: 20px;
        background-color: #f8f8f8;
        border-radius-bottomleft: 5px !important;
        border-radius-bottomright: 5px !important;
        -webkit-border-bottom-left-radius: 5px;
        -webkit-border-bottom-right-radius: 5px;
        border-top: 2px solid #e5e5e5;
    }
</style>
<script>
    export default{
        data(){
            return {
                msg: "街道办事处"
            }
        },
        components: {}
    }
</script>
