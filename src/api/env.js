/**
 * @param {baseUrl} 数据请求全局接口
 * @param {imgUrl}  图片上传全局接口
 * @param {wsUrl}   websocket接口
 */

let baseUrl;
let imgUrl;
let wsUrl;

if (process.env.NODE_ENV === 'development') {
  //测试环境
  imgUrl = 'http://java2.kingwant.local:1234/attachment';
  // baseUrl = 'http://java2.kingwant.local:1234';
  baseUrl = 'http://10.10.0.56:8080';//MENG
  // baseUrl = 'http://10.10.0.203:8080';//XIE
  wsUrl = "ws://java2.kingwant.local:1234/myWebSocketHandler"
} else {
  //正式环境
  imgUrl = 'http://java2.kingwant.local:1234/attachment';
  baseUrl = 'http://java2.kingwant.local:1234';
  wsUrl = ""
}

export {
  baseUrl,
  imgUrl,
  wsUrl,
}

