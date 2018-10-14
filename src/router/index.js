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
            component: () => import('@/components/common/Home.vue'),
            redirect: '/table',
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
                    meta: {
                        title: '节目配置',
                        requireAuth: true
                    }
                },
                {
                    path: '/404',
                    component: () => import('@/components/page/404.vue'),
                    meta: { title: '404' }
                },
                {
                    path: '/403',
                    component: () => import('@/components/page/403.vue'),
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
