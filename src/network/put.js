import {request} from "./request.js";
//封装put修改请求,后台api有一个put的接口，直接用put即可
export function put(url,data={}) {
  //默认配置
  let sendObject={
    url: url,
    method: 'put',
    data:data
  };
  return request(sendObject)
}