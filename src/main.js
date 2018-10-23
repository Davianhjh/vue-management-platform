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
    const accessToken = localStorage.getItem('accessToken');
    if(accessToken === null && to.path !== '/login'){
        next('/login');
    }else if(to.meta.requireAuth){
        accessToken === 'yiosdahfadf' ? next() : next('/403');
    }else{
        next();
    }
});

new Vue({
    router,
    render: h => h(App)
}).$mount('#app');
