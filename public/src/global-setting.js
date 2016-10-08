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
            scanNews: {
                filterType: ''
            }
        }
    },
    methods: {
        //获取查看新闻的类型之后，自动重置其为初始值
        getScanNewsFilterType: function () {
            var type = this.scanNews.filterType;
            this.scanNews.filterType = '';
            return type;
        },
        setScanNewsFilterType: function (type) {
            this.scanNews.filterType = type;
        }
    }
});