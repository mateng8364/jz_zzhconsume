<template>
  <div class="matchResult">
      匹配结果页2
    <div class="submit">
      <van-button type="info" @click="submit">立即预约</van-button>
    </div>
  </div>
</template>

<script>
import { ajaxUrl } from '../ajax/ajaxApi'
import axios from '../ajax/ajaxConfig'
import { getAppUserData, getAppSign, convertSign, convertCommonParam } from '../tool/tools'

export default {
  data () {
    return {
      userInfo: {},
      saveH5ProcessMap: {},
      userData: {},
      resultType: ''
    }
  },
  methods: {
    getUserInfo (userInfo) {
      this.userInfo = userInfo
      getAppSign(this.getUserData, convertCommonParam(this.userInfo))
    },
    getUserData (sign) {
      let map = convertCommonParam(this.userInfo)
      map.md5sign = convertSign(sign)
      axios({
        url: ajaxUrl.rootUrl + ajaxUrl.getUserInfo,
        method: 'post',
        params: map,
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
      })
        .then(res => {
          this.userData = res.data.data
          console.log(this.userData)
        })
        .catch(err => console.log(err))
    },
    submit () {
      let saveH5ProcessMap = {}
      saveH5ProcessMap = convertCommonParam(this.userInfo)
      saveH5ProcessMap.productCode = this.userInfo.productCode
      saveH5ProcessMap.processCode = 'matchResult2'
      saveH5ProcessMap.processName = '周周花消费卡匹配结果页'
      saveH5ProcessMap.url = window.location.href
      saveH5ProcessMap.html = ''
      this.saveProcessMap = saveH5ProcessMap
      getAppSign(this.saveH5Process, saveH5ProcessMap)
    },
    saveH5Process (sign) {
      let map = this.saveProcessMap
      map.md5sign = convertSign(sign)
      axios({
        url: ajaxUrl.rootUrl + ajaxUrl.saveH5Process,
        method: 'post',
        params: map,
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
      })
        .then(res => {
          if (res.data.retcode === 1000) {
            console.log('matchResult2保存节点成功')
            this.$router.replace('/reservation')
          } else {
            if (res.retmsg) {
              console.log(res.retmsg)
            }
          }
        })
        .catch(err => console.log(err))
    }
  },
  created () {
    window.getUserInfo = this.getUserInfo
    window.getUserData = this.getUserData
    window.saveH5Process = this.saveH5Process
    getAppUserData(this.getUserInfo)
    document.title = '匹配结果'
    this.resultType = window.localStorage.getItem('resultType') ? window.localStorage.getItem('resultType') : '套餐方案'
  }
}
</script>

<style lang="scss" scoped>
.submit {
  margin: 10px 20px;;
  text-align: center;
  .van-button {
    width: 100%;
    font-size: 14px;
    border-radius: 4px;
  }
}
</style>
