<template>
    <div class="background">
        <advice-scan-list v-if="state=='list'"></advice-scan-list>
        <advice-scan-page v-if="state=='page'"></advice-scan-page>
    </div>
</template>
<style scoped>
    .background {
        padding-bottom: 20px;
        background-color: white;
        border-radius: 0 !important;
    }

</style>
<script>
    import Bus from '../event-bus.js'
    import scanAdviceList from './advice-scan-list.vue'
    import scanAdvicePage from './advice-scan-page.vue'
    export default{
        data(){
            return {
                state: "list",
                id: null
            }
        },
        created: function () {
            var self = this;
            Bus.$on("setScanAdviceState", function (state) {
                self.state = state;
            });
        },
        methods: {},
        components: {
            'advice-scan-list': scanAdviceList,
            'advice-scan-page': scanAdvicePage
        }
    }
</script>
