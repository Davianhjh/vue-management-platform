import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

export default new Router({
    routes: [
        {
            path: '/',
            redirect: '/login'
        },
        {
            path: '/index',
            component: resolve => require(['../components/common/Home.vue'], resolve),
            redirect: '/table',
            meta: { title: '自述文件' },
            children:[
                {
                    path: '/table',
                    component: resolve => require(['../components/page/BaseTable.vue'], resolve),
                    name: 'Banner配置',
                    meta: {
                        title: 'Banner配置',
                        requireAuth: true
                    }
                },
                {
                    path: '/tabs',
                    component: resolve => require(['../components/page/ProgramTable.vue'], resolve),
                    meta: {
                        title: '节目配置',
                        requireAuth: true
                    }
                },
                {
                    path: '/404',
                    component: resolve => require(['../components/page/404.vue'], resolve),
                    meta: { title: '404' }
                },
                {
                    path: '/403',
                    component: resolve => require(['../components/page/403.vue'], resolve),
                    meta: { title: '403' }
                },
            ]
        },
        {
            path: '/login',
            component: () => import('@/components/page/Login.vue'),
        },
        {
            path: '*',
            redirect: '/404'
        }
    ]
})
