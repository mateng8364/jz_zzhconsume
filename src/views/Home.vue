<template>
  <div class="home">
    <van-loading type="spinner" :size='70'/>
  </div>
</template>

<script>
import Vue from 'vue'
import { Loading } from 'vant'
import { getAppUserData, convertSign, deepClone, getAppSign, convertCommonParam } from './../tool/tools'
import { ajaxUrl } from '../ajax/ajaxApi'
import axios from '../ajax/ajaxConfig'

Vue.use(Loading)
export default {
  data () {
    return {
      userInfo: {},
      queryH5processMap: {},
      startTime: ''
    }
  },
  methods: {
    getUserInfo (userInfo) { // 获取用户信息 获取查询节点map
      this.userInfo = userInfo
      let queryH5processMap = convertCommonParam(userInfo)
      this.queryH5processMap = queryH5processMap
      getAppSign(this.queryH5process, queryH5processMap)
    },
    queryH5process (sign) { // 查询h5流程节点
      let queryH5processMap = deepClone(this.queryH5processMap)
      queryH5processMap.md5sign = convertSign(sign)
      this.queryH5Ajax(queryH5processMap)
    },
    async queryH5Ajax (queryH5processMap) {
      try {
        const res = await axios({
          url: ajaxUrl.rootUrl + ajaxUrl.getH5Process,
          method: 'post',
          params: queryH5processMap,
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        })
        if (res.data.retcode === 1000) {
          if (res.data.data.length !== 0) {
            let node = res.data.data[0].processCode
            if (node === '') {
              this.$router.replace('/review')
            } else if (node === 'review') {
              this.$router.replace('/service')
            } else {
              this.$router.replace('/review')
            }
          } else {
            this.$router.replace('/review')
          }
        } else {
          console.log(res.data.retmsg)
        }
      } catch (err) {
        console.log(err)
      }
    }
  },
  created () {
    window.queryH5process = this.queryH5process
    window.getUserInfo = this.getUserInfo
    getAppUserData(this.getUserInfo)
  }
}
</script>

<style lang="scss" scoped>
.home {
  width: 100%;
  height: 100%;
  overflow: scroll;
}
.van-loading {
  position: fixed;
  top: 30%;
  left: 50%;
  transform: translateX(-50%);

}
</style>
