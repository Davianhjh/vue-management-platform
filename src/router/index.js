import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

export default new Router({
    routes: [
        {
            path: '/',
            // redirect: '/dashboard'
            redirect: '/table'
        },
        {
            path: '/',
            component: resolve => require(['../components/common/Home.vue'], resolve),
            meta: { title: '自述文件' },
            children:[
                {
                    path: '/table',
                    component: () => import('@/components/page/BaseTable.vue'),
                    name: 'Banner配置',
                    meta: {
                        title: 'Banner配置',
                        requireAuth: true
                    }
                },
                {
                    path: '/tabs',
                    component: () => import('@/components/page/ProgramTable.vue'),
                    meta: { title: '节目配置' }
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
                }
            ]
        },
        {
            path: '/login',
            component: resolve => require(['../components/page/Login.vue'], resolve)
        },
        {
            path: '*',
            redirect: '/404'
        }
    ]
})
