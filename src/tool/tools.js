import { ajaxUrl } from '../ajax/ajaxApi'
import axios from '../ajax/ajaxConfig'
import moment from 'moment'

export let constant = {
  'JS_TO_JZ': 'JS_TO_JZ',
  'XYB_Q_CODE': 'xybqid00',
  'PRODUCT_CODE': 'xld'
}

// 校验是否浏览器打开,浏览器打开页面则跳转到error页
export function validPage () {
  try {
    let system = judgeSystem()
    if (system === 'android') {
      window[constant.JS_TO_JZ].getUserInfo()
    } else if (system === 'ios') {
      let params = {
        'type': 'getUserInfo',
        'data': {
          'method': 'initGetUserInfo' // 把回传token的js方法名传过去
        }
      }
      let paramsStr = JSON.stringify(params)
      window.webkit.messageHandlers[constant.JS_TO_JZ].postMessage(paramsStr)
    } else {
      // console.log('不支持的操作系统')
      window.location.href = 'error.html'
    }
  } catch (e) {
    window.location.href = 'error.html'
  }
}

// ios回调函数
// export function initGetUserInfo (userinfo) {
//   console.log(userinfo)
//   let a = judgeSystem()
//   console.log(a)
// }

// 当前页面的url存入sessionStorage
export function setLocalUrl () {
  var localUrl = window.location.href
  if (localUrl.indexOf('index.html') < 0) { // index.html页面不存入sessionStorage
    window.sessionStorage.setItem('localUrl', localUrl)
  }
}

// 判断当前系统，返回系统名
export function judgeSystem () {
  if (/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)) {
    return 'ios'
  } else if (/(Android)/i.test(navigator.userAgent)) {
    return 'android'
  } else {
    return 'pc'
  }
}

// 获取用户信息
export function getAppUserData (callback) {
  let system = judgeSystem()
  if (system === 'android') {
    let userinfo = window[constant.JS_TO_JZ].getUserInfo()
    callback(JSON.parse(userinfo))
  } else if (system === 'ios') {
    receiveUserInfo(callback.name)
  } else {
    console.log('不支持的操作系统')
  }
}
// 从苹果获取原生userInfo
export function receiveUserInfo (callbackName) {
  callbackName = callbackName.split('bound ')[1]
  let params = {
    'type': 'getUserInfo',
    'data': {
      'method': callbackName// 把回传token的js方法名传过去
    }
  }
  let paramsStr = JSON.stringify(params)
  window.webkit.messageHandlers[constant.JS_TO_JZ].postMessage(paramsStr)
  // getData(testData())
  // saveH5Pro(testData())
  // setTimeout(function(){saveH5Pro(testData())},500);
}

// 获取公共参数 -- 浅克隆？
// var commonParam = {};
export function convertCommonParam (obj) {
  return {
    userid: obj.userid,
    merchantcode: obj.merchantcode,
    applyId: obj.applyId,
    token: obj.token,
    channelid: obj.channelid,
    appid: obj.appid,
    clienttype: obj.clienttype
  }
}

// 获取产品代码  -- 对象的productCode属性赋予一个空对象？
export function convertProductCode (obj) {
  return {
    productCode: obj.productCode
  }
}

// 测试数据  -- 返回一个固定对象
export function testData () {
  return {
    userid: '5B2733955AE847DF218BABF0D553999D',
    merchantcode: 'PZxkSS',
    applyId: 'TS201911283197478922',
    token: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzM4NCJ9.eyJuYW1lIjoi5byg5rWpIiwiZXhwIjoxNTc1OTQzMjExLCJ1c2VyaWQiOiI1QjI3MzM5NTVBRTg0N0RGMjE4QkFCRjBENTUzOTk5RCJ9.tws9vUkHmukOCVfZ-Rywh7989eIJovgCmfJITxJb39Z6jXwJC7CKEdyNOpJaVd-Y'
  }
}

// 获取签名sign
export function getAppSign (callback, param) {
  let system = judgeSystem()
  if (system === 'android') {
    let signinfo = window[constant.JS_TO_JZ].getNativeSign(JSON.stringify(param))
    callback(signinfo)
  } else if (system === 'ios') {
    getSign(callback.name, param)
  } else {
    // console.log('不支持的操作系统')
  }
}
// 苹果系统回调处理
export function getSign (callbackName, param) {
  callbackName = callbackName.split('bound ')[1]
  let params = {
    'type': 'getNativeSign',
    'data': {
      'method': callbackName, // 把回传token的js方法名传过去
      'params': param
    }
  }
  let paramsStr = JSON.stringify(params)
  window.webkit.messageHandlers[constant.JS_TO_JZ].postMessage(paramsStr)
  // getSign(testData())
}

// sign返回判断: ios返回值只能传object,android返回值只能传string
export function convertSign (obj) {
  var sign = ''
  if (typeof (obj) === 'string') {
    sign = obj
  } else {
    sign = obj.sign
  }
  return sign
}

// 保存h5流程节点
export function saveH5Process (processMap, productCode, processCode, processName, callback) {
  let saveH5ProcessMap = {}
  // let callbackH5Process = callback
  saveH5ProcessMap = convertCommonParam(processMap)
  saveH5ProcessMap.productCode = productCode
  saveH5ProcessMap.processCode = processCode
  saveH5ProcessMap.processName = processName
  saveH5ProcessMap.url = window.location.href
  saveH5ProcessMap.html = ''
  // 调接口
  /*   function saveH5ProcessSign (obj) {
    saveH5ProcessMap.md5sign = convertSign(obj)
    axios({
      url: ajaxUrl.rootUrl + ajaxUrl.saveH5Process,
      method: 'post',
      data: saveH5ProcessMap
    }).then(
      res => {
        if (res.retcode === '1000') {
          console.log('H5流程节点保存成功')
          // 跳转到路由页面
          callbackH5Process(res.data)
          // getAppUserData(callbackSubmit);
        } else {
          if (res.retmsg) {
            console.log(res.retmsg)
          }
        }
      }
    ).catch(
      err => console.log(err)
    )
  } */
  getAppSign(callback, saveH5ProcessMap)
}

// 落库埋点
export let maidianData = {}
export function maidian (maidianParam) {
  maidianData = maidianParam
  let map = {}
  let system = judgeSystem()
  if (system === 'android') {
    let userinfo = window[constant.JS_TO_JZ].getUserInfo()
    map = JSON.parse(userinfo)
    map.product_name = 'cps_v4_db_v1'
    map.apply_id = JSON.parse(userinfo).applyId
    map.user_id = JSON.parse(userinfo).userid
    map.ip_address = ''
    map.operation_time = getTime()
    map.remarks = ''
    map = { ...maidianData, ...map }
    maidianAjax(map)
  } else if (system === 'ios') {
    getUserInfo1()
  } else {
    console.log('不支持的操作系统')
  }
}
// 从苹果获取原生userInfo
export function getUserInfo1 () {
  let params = {
    'type': 'getUserInfo',
    'data': {
      'method': 'didReceiveUserInfoFromIos1' // 把回传token的js方法名传过去
    }
  }
  let paramsStr = JSON.stringify(params)
  window.webkit.messageHandlers[constant.JS_TO_JZ].postMessage(paramsStr)
}
export function didReceiveUserInfoFromIos1 (map) { // ios回调函数
  let temp = map
  map.product_name = 'cps_v4_db_v1'
  map.apply_id = temp.applyId
  map.user_id = temp.userid
  map.ip_address = ''
  map.operation_time = getTime()
  map.remarks = ''
  map = { ...maidianData, ...map }
  maidianAjax(map)
}

export async function maidianAjax (appMap) {
  try {
    const res = await axios({
      methods: 'POST',
      url: ajaxUrl.rootUrl + ajaxUrl.maidianUrl,
      params: appMap,
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    })
    if (res.data.retcode === 1000) {
      // alert(JSON.stringify(res))
      console.log('埋点成功')
    } else {
      console.log('埋点失败')
    }
  } catch (err) {
    console.log('埋点异常')
  }
}

// 获取当前时间（指定时间格式）
export function getTime () {
  let time = new Date()
  // let ms = time.getMilliseconds()
  return moment(time).format(`YYYY-MM-DD HH:mm:ss.SSS`) + 'ms'
}

// APP接口方法封装
// 关闭当前web容器页面
export function closeWeb () {
  let system = judgeSystem()
  if (system === 'android') window[constant.JS_TO_JZ].closeWeb()
  else if (system === 'ios') {
    let params = {
      'type': 'closeWindow'
    }
    window.webkit.messageHandlers[constant.JS_TO_JZ].postMessage(JSON.stringify(params))
  } else {
    console.log('不支持的操作系统')
  }
}

// 打开新页面
export function openAppNewWeb (url) {
  let system = judgeSystem()
  if (system === 'android') {
    // alert(url)
    window[constant.JS_TO_JZ].openNewWebWindow(url)
  } else if (system === 'ios') {
    let params = {
      type: 'openNewWebWindow',
      data: {
        url
      }
    }
    let paramsStr = JSON.stringify(params)
    window.webkit.messageHandlers[constant.JS_TO_JZ].postMessage(paramsStr)
  } else {
    console.log('不支持的操作系统')
  }
}

// 打开支付页面   支付成功app会调用window.nativeDidFinishPayment方法（必须提供）
export function goToPay () {
  let system = judgeSystem()
  if (system === 'android') {
    window[constant.JS_TO_JZ].goToPay()
  } else if (system === 'ios') {
    let params = {
      'type': 'openPay',
      'data': {
        'method': 'nativeDidFinishPayment'
      }
    }
    window.webkit.messageHandlers[constant.JS_TO_JZ].postMessage(JSON.stringify(params))
  } else {
    console.log('不支持的操作系统')
  }
}

// 打开绑银行卡页面  支付成功app会调用window.nativeBindBankCardSuccess方法（必须提供）
export function goToBindBankCard () {
  let system = judgeSystem()
  if (system === 'android') {
    window[constant.JS_TO_JZ].goToBindBankCard()
  } else if (system === 'ios') {
    let params = {
      'type': 'goToBindBankCard',
      'data': {
        'method': 'nativeBindBankCardSuccess'
      }
    }
    window.webkit.messageHandlers[constant.JS_TO_JZ].postMessage(JSON.stringify(params))
  } else {
    console.log('不支持的操作系统')
  }
}

// 打开联系人页面  选择结束app会调用window.nativeDidSelectContact方法（必须提供）参数接收obj
export function openContacts () {
  let system = judgeSystem()
  if (system === 'android') {
    window[constant.JS_TO_JZ].openContacts()
  } else if (system === 'ios') {
    let params = {
      'type': 'openContacts',
      'data': {
        'method': 'nativeDidSelectContact'
      }
    }
    window.webkit.messageHandlers[constant.JS_TO_JZ].postMessage(JSON.stringify(params))
  } else {
    console.log('不支持的操作系统')
  }
}

// 获取全部联系人数据  获取结束app调用window.nativeAllContactsData方法（必须提供）参数接收obj
export function getAllNativeContacts () {
  let system = judgeSystem()
  if (system === 'android') {
    window[constant.JS_TO_JZ].getAllNativeContacts()
  } else if (system === 'ios') {
    let params = {
      'type': 'getAllNativeContacts',
      'data': {
        'method': 'nativeAllContactsData'
      }
    }
    window.webkit.messageHandlers[constant.JS_TO_JZ].postMessage(JSON.stringify(params))
  } else {
    console.log('不支持的操作系统')
  }
}

// 打开合同页面  签署完成app调用window.nativeContractsSignSuccess方法（必须提供）
export function openContracts () {
  let system = judgeSystem()
  if (system === 'android') {
    window[constant.JS_TO_JZ].openContracts()
  } else if (system === 'ios') {
    let params = {
      'type': 'openContracts',
      'data': {
        'method': 'nativeContractsSignSuccess'
      }
    }
    window.webkit.messageHandlers[constant.JS_TO_JZ].postMessage(JSON.stringify(params))
  } else {
    console.log('不支持的操作系统')
  }
}

// 字符串处理  cps页面对于用户文本进行处理，返出对象
export function stringify (string) {
  let text = string.replace(/'/g, '"')
  return JSON.parse(String(text))
}

// 深度克隆
export function deepClone (obj) {
  let result
  let oClass = isClass(obj)
  if (oClass === 'Object') {
    result = {}
  } else if (oClass === 'Array') {
    result = []
  } else {
    return obj
  }
  for (let key in obj) {
    let copy = obj[key]
    if (isClass(copy) === 'Object') {
      result[key] = deepClone(copy) // 递归调用
    } else if (isClass(copy) === 'Array') {
      result[key] = deepClone(copy)
    } else {
      result[key] = obj[key]
    }
  }
  return result
}
// 判断对象的数据类型
export function isClass (o) {
  if (o === null) return 'Null'
  if (o === undefined) return 'Undefined'
  return Object.prototype.toString.call(o).slice(8, -1)
}
