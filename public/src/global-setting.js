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
            ]
        }
    }
});