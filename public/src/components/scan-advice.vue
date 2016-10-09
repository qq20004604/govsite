<template>
    <div class="background">
        <scan-advice-list v-if="state=='list'"></scan-advice-list>
        <scan-advice-page v-if="state=='page'"></scan-advice-page>
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
    import scanAdviceList from './scan-advice-list.vue'
    import scanAdvicePage from './scan-advice-page.vue'
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
            'scan-advice-list': scanAdviceList,
            'scan-advice-page': scanAdvicePage
        }
    }
</script>
