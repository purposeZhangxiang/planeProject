import {http} from '../api/http.js'
import router from '../router/router'
export default {
    /**
     * @method login 登录逻辑
     * @method
     */
    login() {
        http("/test/login", "get").then(res => {
            sessionStorage.setItem('token','1511311313')
            router.push("/home");
          });
    },
    alert(){
        alert('调用actions')
    }
}