/**
 * Created by wd on 2016/10/6.
 */

import Vue from 'vue'

export default new Vue({
    data(){
        return {
            types: [
                {name: "announcement", value: "公告", area: [0, 4], isAnnouncement: true},
                {name: "news", value: "新闻", area: [0, 3], isAnnouncement: false},
                {name: "knowledge", value: "知识", area: [0, 3], isAnnouncement: false},
                {name: "others", value: "其他", area: [0, 3], isAnnouncement: false}
            ],
            app: null, //用这个来获取app.vue这个组件
            //浏览新闻页面的筛选类型
            scanNews: {
                filterType: ''
            },
            scanAdvice: {
                id: null
            }
        }
    },
    methods: {
        //获取查看新闻的类型之后，自动重置其为初始值【浏览页面】
        getScanNewsFilterType: function () {
            var type = this.scanNews.filterType;
            this.scanNews.filterType = '';
            return type;
        },
        setScanNewsFilterType: function (type) {
            this.scanNews.filterType = type;
        },
        //设置和获取app这个组件
        setAppComponent: function (APP) {
            this.app = APP;
        },
        getAppComponent: function () {
            return this.app;
        },

        //【互动交流页面】
        // 获取和设置查看新闻的id
        getScanAdviceId: function () {
            var id = this.scanAdvice.id;
            this.scanAdvice.id = null;
            return id;
        },
        setScanAdviceId: function (id) {
            this.scanAdvice.id = id;
        }
    }
});