import router from '../router/router'; //根据自己定义的路由位置进行引入
import axios from 'axios';
import qs from 'qs'; //序列化参数的第三方模块
import {
    baseUrl,
    imgUrl
} from './env'; //baseUrl config
import {
    Loading,
    Message
} from 'element-ui'; //elementUI错误弹框组件



//登陆
const login = (apiName, method, data) => {
    if (!apiName) {
        return
    }
    //登陆接口需要序列化参数
    let config = {
        url: baseUrl + apiName,
        method: method || 'post',
        data: qs.stringify(data) || {}
    }
    return new Promise((resolve, reject) => {
        axios(config)
            .then(res => {
                if (res.data.hasOwnProperty("access_token")) {
                    resolve(res.data)
                } else {}
            })
            .catch(err => {
                Message({
                    message: err.response.data.error_description,
                    type: "error"
                });
                return;
            })

    })

}
const sendRequest = (apiName, method, data, responseType = "json") => {
    return sendRequestH(apiName, method, data, false, responseType);

}
//接口请求
const sendRequestH = (apiName, method, data, loadding = true, responseType = "json") => {
    if (!apiName) {
        return
    }
    //定义请求参数配置
    let config = {
        url: baseUrl + apiName || '',
        method: method || 'get',
        params: data || '',
        data: data || {},
        headers: {},
        loadding,
        responseType
    }
    //token验证
    // if (sessionStorage.getItem('token')) {
    //     config.headers["Authorization"] = "Bearer " + sessionStorage.getItem('token')
    // } else {
    //     router.push({
    //         path: '/login'
    //     });
    //     return;
    // }


    //关于data的处理,如果后台按照序列化的标准接受就采用qs模块去处理post请求参数
    if (!data) {
        delete config.params;
        delete config.data;
    } else {
        if (method == 'get' || method == 'GET' || method == 'put' || method == 'PUT' || method == 'delete' || method == 'DELETE') {
            delete config.data
        } else if (method == 'post' || method == 'POST') {
            delete config.params
        }
    }

    //loadding框
    let loaddingObj;
    if (config.loadding) {
        loaddingObj = Loading.service({
            target: document.getElementsByClassName('route')[0],
            lock: true,
            text: '拼命加载中...',
            fullscreen: false
        });
    }
    return new Promise((resolve, reject) => {
        axios(config)
            .then(res => {
                if (res.status == 200) {
                    //可和后台协商一个code字段意为请求成功
                    if (res.data.result === "0000") {
                        resolve(res.data.data)
                    } else if (config.responseType == "blob") {
                        downloadExcel(res.data);
                    } else {
                        Message.error(res.data.msg)
                        reject(res.data)
                    }

                }
                config.loadding && loaddingObj && loaddingObj.close();
            })
            .catch(err => {
                config.loadding && loaddingObj && loaddingObj.close();
                //错误提示
                Message.error(err);
                reject(err)
            })

    })

}

function downloadExcel(data, type) {
    if (!data) {
        return;
    }
    let url = window.URL.createObjectURL(new Blob([data]));
    let link = document.createElement('a');
    link.style.display = 'none';
    link.href = url;
    link.setAttribute('download', 'file.zip');
    document.body.appendChild(link);
    link.click();
}

export {
    login,
    sendRequest as http,
    sendRequestH as httpHasLoad,
};