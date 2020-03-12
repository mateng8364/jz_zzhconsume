<template>
  <div class="service">
    <!-- 标题区域 -->
    <div class="title">
      <p>分期额度：50000</p>
    </div>
    <!-- 内容区域 -->
    <div class="content">
      <div class="content-t">
        <p>精选服务</p>
      </div>
      <div class="content-c">
        <ul>
          <li v-for="item in productList" :key="item.number" @click="toNext(item.link)">
            <div class="product">
              <img :src="item.img_src" alt="">
              <!-- <div class="service-tit">
                {{ item.name }}
              </div>
              <div class="service-intro">
                {{ item.intro_text }}
              </div>
              <div class="service-adver">
                {{ item.process_text }}
              </div> -->
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import { ajaxUrl } from '../ajax/ajaxApi'
import axios from '../ajax/ajaxConfig'
import { getAppUserData, getAppSign, convertSign, convertCommonParam } from '../tool/tools'
import { productList } from './../assets/data/productList'

export default {
  data () {
    return {
      userInfo: {},
      saveH5ProcessMap: {},
      nextPage: 'decoration',
      productList
    }
  },
  methods: {
    getUserInfo (userInfo) {
      this.userInfo = userInfo
    },
    toNext (value) {
      this.nextPage = value
      let saveH5ProcessMap = {}
      saveH5ProcessMap = convertCommonParam(this.userInfo)
      saveH5ProcessMap.productCode = this.userInfo.productCode
      saveH5ProcessMap.processCode = `service_${value}`
      saveH5ProcessMap.processName = '周周花消费卡精选服务页'
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
            console.log('service保存节点成功')
            this.$router.push(`/${this.nextPage}`)
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
    window.saveH5Process = this.saveH5Process
    getAppUserData(this.getUserInfo)
    document.title = '周周花精选服务'
  }
}
</script>

<style lang="scss" scoped>
.title {
  margin: 20px 0px;
  p {
    height:22px;
    font-size:16px;
    font-family:PingFang-SC-Medium,PingFang-SC;
    font-weight:500;
    color:rgba(136,136,136,1);
    line-height:22px;
    text-align: center;
  }
}
.content {
  padding: 0px 20px;
  .content-t {
    p {
      height:22px;
      font-size:16px;
      font-family:PingFang-SC-Bold,PingFang-SC;
      font-weight:bold;
      color:rgba(68,68,68,1);
      line-height:22px;
    }
  }
  .content-c {
    ul {
      li {
        margin: 10px 0px;
        position: relative;
        // height: 100px;
        .product {
          img {
            width: 100%;
            height: auto;
          }
        }
      }
    }
  }
}
</style>
