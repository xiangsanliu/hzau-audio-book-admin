import {Loading, Message, MessageBox} from "element-ui";
import axios from 'axios';

axios.defaults.withCredentials = true;
axios.defaults.baseURL = 'http://211.69.130.104:8081/';


/**
 * HTTP GET
 * @param url url
 * @param onSuccess Success Callback
 */
export const httpGet = (url, onSuccess) => {
    let loadingInstance = Loading.service(
        {
            fullscreen: true,
            text: "加载中"
        }
    );
    axios.get(url).then(response => {
        loadingInstance.close();
        handleResponseBean(response.data, onSuccess);
    }).catch(error => {
        loadingInstance.close();
        Message.error(error.response.data);
    })
};

/**
 * HTTP GET
 * @param url url
 * @param postData Post Data
 * @param onSuccess Success Callback
 * @param onFailure
 * axios.iFailure Callback
 */
export const httpPost = (url, postData, onSuccess, onFailure) => {
    let loadingInstance = Loading.service(
        {
            fullscreen: true,
            text: "加载中"
        }
    );
    axios.post(url, postData).then(response => {
        loadingInstance.close();
        handleResponseBean(response.data, onSuccess, onFailure);
    }).catch(error => {
        loadingInstance.close();
        Message.error(error.response.data);
    })
};

export const removeRecord = (url, id, onSuccess) => {
    MessageBox.confirm('此操作将永久删除该记录,是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
    }).then(() => {
        httpPost(url + id, null, onSuccess);
    }).catch(() => {
        Message.info('已取消删除');
    });
};


/**
 * Handle Response From SpringBoot
 * @param responseBean Defined in SpringBoot: ResponseBean.class
 * @param onSuccess Success Callback
 * @param onFailure Failure Callback
 */
const handleResponseBean = (responseBean, onSuccess, onFailure) => {
    if (200 === responseBean.status) {
        onSuccess(responseBean);
    } else if (401 === responseBean.status) {
        MessageBox.alert('未登录,请先登录!', '提示', {
            confirmButtonText: '确定',
            callback: function () {
                window.location.href = "/login";
            }
        });
    } else if (403 === responseBean.status) {
        Message.error('无此权限');
    } else {
        // 自定义处理错误方式
        onFailure(responseBean);
    }
};

