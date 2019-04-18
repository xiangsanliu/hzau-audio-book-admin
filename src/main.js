import Vue from 'vue'
import App from './Main.vue'
import ElementUI from 'element-ui';
import VueRouter from 'vue-router';
import 'element-ui/lib/theme-chalk/index.css';
import {httpGet, httpPost, removeRecord} from "./utils/http";
import Login from '@/components/Login'
import Navigation from '@/components/Navigation'
import BookManage from "@/components/nav/BookManage";
import BookListManage from "@/components/nav/BookListManage";
import ActivityManage from "@/components/nav/ActivityManage";
import ShortAudioManage from "@/components/nav/ShortAudioManage";
import ShortCommentManage from "@/components/nav/ShortCommentManage";
import BookCommentManage from "@/components/nav/BookCommentManage";


Vue.use(VueRouter);
Vue.use(ElementUI);
Vue.prototype.httpGet = httpGet;
Vue.prototype.httpPost = httpPost;
Vue.prototype.removeRecord = removeRecord;
Vue.prototype.fileUrl = 'http://211.69.130.104/';
Vue.prototype.protoUploadUrl = 'http://211.69.130.104:8081/';
Vue.config.productionTip = false;

const router = new VueRouter({
    mode: 'history',
    routes: [
        {
            path: '/login',
            component: Login
        },
        {
            path: '/',
            component: Navigation,
            children: [
                {
                    path: '/book',
                    component: BookManage
                },
                {
                    path: '/bookList',
                    component: BookListManage
                },
                {
                    path: '/activity',
                    component: ActivityManage
                },
                {
                    path: '/shortAudio',
                    component: ShortAudioManage
                },
                {
                    path: '/shortComment',
                    component: ShortCommentManage
                },
                {
                    path: '/bookComment',
                    component: BookCommentManage
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
