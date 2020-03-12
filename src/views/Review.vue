<template>
  <div class="review">
    <!-- 标题区域 -->
    <div class="title">
      <p>恭喜您，审批通过！</p>
    </div>
    <!-- banner区域 -->
    <div class="banner">
      <div class="banner-t">
        已获得以下金融服务：
      </div>
      <div class="banner-c">
        分期额度50000元
      </div>
      <div class="banner-b">
        <p>装修、买车、买房、旅游、培训教育，尽享优惠！</p>
      </div>
    </div>
    <div class="submit">
      <van-button type="info" @click="submit">开始使用</van-button>
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
      userData: {}
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
      saveH5ProcessMap.processCode = 'review'
      saveH5ProcessMap.processName = '周周花消费卡审批页'
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
            console.log('review保存节点成功')
            this.$router.push('/service')
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
    document.title = '审批结果'
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
