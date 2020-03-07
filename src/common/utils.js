// 防抖函数，避免一定时间内执行太多次数
export function debounce (func, delay=200){
  let timer =null

  return function (...args) {
    if (timer) clearTimeout(timer)

    timer = setTimeout(() => {
      //这里用apply传入this,是因为箭头函数没有this,传入this让this指向vue
      func.apply(this,args)
    },delay)
  }
}

// 将时间戳转换成需要的时间,date为原时间（总秒），fmt为需要转化成的时间格式
export function formatDate (date, fmt) {
  // 1.转换年，
    //判断，如果存在年(y)
  if (/(y+)/.test(fmt)) {
    // fmt等于找到的年RegExp.$1，用getFullYear来获取年份，再根据substr截取几个字符，截取的长度为里面的4减去找到的年字符个数
    fmt = fmt.replace(RegExp.$1,(date.getFullYear() + '').substr(4 - RegExp.$1.length))
  }

  // 2.转换月日时分秒
  let o = {
    'M+' : date.getMonth() + 1,
    'd+':date.getDate(),
    'h+':date.getHours(),
    'm+':date.getMinutes(),
    's+':date.getSeconds()
  };

  for (let k in o) {
    if (new RegExp(`(${k})`).test(fmt)) {
      let str = o[k] + '';
        fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? str : padLeftZero(str));
    }
  }
  return fmt
}

function padLeftZero(str) {
  //补齐月天时分秒的长度
    return ('00' + str).substr(str.length)
}
