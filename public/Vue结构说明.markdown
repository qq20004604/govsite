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
    |---- news-manage.vue    //新闻管理（后台）
    |   |
    |   |---- news-create.vue    //新建新闻（发送）
    |   |
    |   |---- news-delete.vue    //删除新闻
    |
    |
    |---- news-scan-list.vue    //新闻列表
    |
    |---- news-view.vue    //新闻阅读页面
    |
    |---- advice-post.vue    //街办信箱，用于提交意见
    |
    |---- advice-scan.vue    //top标签的浏览反馈
    |   |
    |   |---- advice-scan-list.vue    //查看反馈列表
    |   |
    |   |---- advice-scan-page.vue    //查看反馈页面（本页面有反馈，管理员编辑反馈也在本页面）
    |
    |---- 