import {request} from "./request.js";

//封装delete请求,后台api有一个delete的接口，直接用delete即可
export function remove(url) {
  //默认配置
  let sendObject={
    url: url,
    method: 'delete',
  };
  return request(sendObject)
}