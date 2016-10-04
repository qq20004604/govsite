##event-bus.js

由于Vue2.0取消了 $dispatch 和 $broadcast 。官方推荐使用global event bus 或 Vuex，这里采用了前者。

简单来说，通过new一个Vue的实例，然后在原本需要使用$dispatch 和 $broadcast，导入这个Vue实例，并用$emit和$on来替代。

这样的话，相当于把所有事件放在同一个Vue实例中，因此是global event bus。


#####事件1
事件名

    setNewsId
    
参数

    id        //number类型
    
$emit

    delete-news.vue
    
$on

    news-view.vue
    
说明

    用于传递查看新闻的id
    

#####事件2
事件名

    setNewsShow
    
参数

    true/false        //boolean类型
    
$emit

    delete-news.vue
    
$on

    news-view.vue
    
说明

    用于设置页面是否显示