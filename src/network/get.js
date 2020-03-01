import {request} from "./request.js";

//封装get请求,后台api有一个get的接口，直接用get即可
export function get(url,data = {}) {
  return request({
    url:url,
    params : data
  })
}