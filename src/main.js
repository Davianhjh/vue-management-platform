import Vue from 'vue';
import App from './App';
import router from './router';
import axios from 'axios';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';    // 默认主题
// import '../static/css/theme-green/index.css';       // 浅绿色主题
import '../static/css/icon.css';
import "babel-polyfill";

Vue.use(ElementUI, { size: 'small' });
Vue.prototype.$axios = axios;

//使用钩子函数对路由进行权限跳转
router.beforeEach((to, from, next) => {
    const access_token = localStorage.getItem('access_token');
    if(access_token === null && to.path !== '/login'){
        next('/login');
    }else if(to.meta.requireAuth){
        access_token === 'yiosdahfadf' ? next() : next('/403');
    }else{
        next();
    }
});

new Vue({
    router,
    render: h => h(App)
}).$mount('#app');
