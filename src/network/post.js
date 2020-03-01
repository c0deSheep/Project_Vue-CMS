import {request} from "./request.js";

//封装post请求,后台api有一个post的接口，直接用post即可
export function post(url, data = {}) {
  //默认配置
  let sendObject={
    url: url,
    method: 'post',
    headers: {
      'Content-Type':'application/json;charset=UTF-8'
    },
    data:data
  };
  sendObject.data=JSON.stringify(data);
  console.log('works')
  return request(sendObject)
}