<template>
  <div class="matchResult">
      <van-circle
        v-model="currentRate"
        :rate="rate"
        :speed="30"
        :text="text"
      />
      <p>根据您的需求, 正在为您匹配分期套餐....</p>
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
      currentRate: 0,
      rate: 98,
      timeId: ''
    }
  },
  methods: {
    getUserInfo (userInfo) {
      this.userInfo = userInfo
      this.timeId = window.setTimeout(() => {
        this.rate = 100
        this.submit()
      }, 3000)
    },
    submit () {
      let saveH5ProcessMap = {}
      saveH5ProcessMap = convertCommonParam(this.userInfo)
      saveH5ProcessMap.productCode = this.userInfo.productCode
      saveH5ProcessMap.processCode = 'matchResult1'
      saveH5ProcessMap.processName = '周周花消费卡匹配结果等待页'
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
            console.log('matchResult1保存节点成功')
            this.$router.replace('/matchResult2')
          } else {
            if (res.retmsg) {
              console.log(res.retmsg)
            }
          }
        })
        .catch(err => console.log(err))
    }
  },
  computed: {
    text () {
      return this.currentRate.toFixed(0) + '%'
    }
  },
  created () {
    window.getUserInfo = this.getUserInfo
    window.saveH5Process = this.saveH5Process
    getAppUserData(this.getUserInfo)
    document.title = '匹配结果'
  }
}
</script>

<style lang="scss" scoped>
.matchResult {
  margin-top: 100px;
  text-align: center;
  font-size: 14px;
}
</style>
