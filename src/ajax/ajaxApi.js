export const ajaxUrl = {
  // 测试
  // "rootUrl": "http://192.168.1.111:8080/rent-server/",
  // uat地址
  'rootUrl': 'https://uat-rent-server.junzhengloan.com/rent-server/',
  // 生产地址
  // 'rootUrl': 'https://rent-server.junzhengloan.com/rent-server/',
  'applyInitUrl': '/creditReport/getPboCData',
  'saveH5Data': 'h5Node/saveH5Data',
  'getH5Process': 'h5Node/getH5Process',
  'saveH5Process': 'h5Node/saveH5Process',
  'dbStart': 'decision/decisionBStart',
  'queryDbStatus': 'decision/getResultDB',
  'dcStart': 'decision/decisionCStart',
  'queryDcStatus': 'decision/getResultDC',
  'queryPayStatus': 'vyp/initiativeRepayment/getMemberPaymentStatus',
  'applyUrl': 'applyRecord/saveApplyInfoXyb',
  'agreementUrl': 'agreement/fetchAgreementTemplate?productCode=2011&type=JJFWXY',
  'pbocUrl': 'creditReport/getCreditReport',
  'maidianUrl': 'userLog/operaterLog',
  'getUserInfo': 'user/userinfo',
  // cps风控埋点接口
  // 'maidianUrl2': 'https://app.junzhengloan.com:8143/h5ad/event_log' // 生产环境
  'maidianUrl2': 'https://uat-rent-server.junzhengloan.com:8143/h5ad/event_log' // uat环境

}
