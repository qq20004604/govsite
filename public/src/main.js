// The following line loads the standalone build of Vue instead of the runtime-only build,
// so you don't have to do: import Vue from 'vue/dist/vue'
// (also, loading Vue standalone this way breaks vueify, so don't do it)
// This is done with the transform "aliasify". For the config, see package.json
import Vue from 'vue'
import App from './App.vue'
global.jQuery = require('jquery');
global.$ = global.jQuery;
require('bootstrap');

Vue.filter("formatTime", function (value) {
    var date = new Date(value);
    return date.getFullYear() + '-' + date.getMonth() + '-' + date.getDate() + '　' + date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();
})

new Vue({ // eslint-disable-line no-new
  el: '#app',
  render: (h) => h(App)
})