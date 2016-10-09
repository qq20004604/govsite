##页面关系

    event-bus.js    //全局事件（假如2个组件之间需要交互，则依靠这个），全局配置
    
    App.vue    //根组件
    |
    |---- main-top.vue    //顶部导航栏
    |
    |---- main-container.vue    //用户正常浏览区域
    |
    |---- main-foot.vue    //页面底部
    |
    |---- login.vue    //登录后台页面
    |
    |---- manage-news.vue    //新闻管理（后台）
    |   |
    |   |---- create-news.vue    //新建新闻（发送）
    |   |
    |   |---- delete-news.vue    //删除新闻
    |
    |
    |---- scan-news-list.vue    //新闻列表
    |
    |---- news-view.vue    //新闻阅读页面
    |
    |---- 