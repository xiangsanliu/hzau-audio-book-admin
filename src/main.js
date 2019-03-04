import Vue from 'vue'
import App from './Main.vue'
import ElementUI from 'element-ui';
import VueRouter from 'vue-router';
import 'element-ui/lib/theme-chalk/index.css';
import {httpGet, httpPost, removeRecord} from "./utils/http";
import Login from '@/components/Login'
import Navigation from '@/components/Navigation'
import BookManage from "@/components/nav/BookManage";
import Home from "@/components/nav/Home";


Vue.use(VueRouter);
Vue.use(ElementUI);
Vue.prototype.httpGet = httpGet;
Vue.prototype.httpPost = httpPost;
Vue.prototype.removeRecord = removeRecord;

Vue.config.productionTip = false;

const router = new VueRouter({
    mode: 'history',
    routes: [
        {
            path: '/login',
            component: Login
        },
        {
            path: '/navigation',
            component: Navigation,
            children: [
                {
                    path: '',
                    component: Home
                },
                {
                    path: '/bookManage',
                    component: BookManage
                }
            ]
        },
        // 这里捕捉 404 页面，暂时先用登录页面顶着
        {
            path: '/*',
            component: Login
        }
    ]
});

new Vue({
    router: router,
    render: h => h(App),
}).$mount('#app');
