<template>
  <div class="selection">
    <!-- 焦点图图区域 -->
    <div class="banner">
      <img src="./../assets/img/banner_01.jpg" alt="">
      <div class="banner-text">
        <img src="./../assets/img/banner_02.jpg" alt="">
        <div class="text">
          <div class="text-tit">
            {{ this.text.cps_text1 }}
          </div>
          <div class="text-con">
            {{ this.text.cps_text2 }}
          </div>
        </div>
      </div>
      <!-- <div class="banner-tip">
        <img src="./../assets/img/cps_banner_03.jpg" alt="">
      </div> -->
    </div>
    <!-- 产品区域 -->
    <!-- <div class="product">
      <ul>
        <li v-for="(item, index) in productList" :key='item.code'>
          <img :src="item.img_src" alt="">
          <div class="word">
            <div class="word-t">{{item.name}}</div>
            <div class="word-m">{{item.intro_text}}</div>
            <div class="word-b" @click="lookIntroduce(index, item.process_text)">查看流程></div>
          </div>
          <div class="link" @click="showConfirm(item.link, index)">
            立即申请
          </div>
        </li>
      </ul>
    </div> -->
    <!-- 新产品区域 -->
    <div class="product-new">
      <img src="./../assets/img/CPS-V4_slices/bg_chanp.png" alt="">
      <div class="product-content">
        <img :src="productList[0].img_src" alt="">
        <div class="title">
          {{ productList[0].name }}
          <p></p>
        </div>
        <p class="content">{{ productList[0].intro_text }}</p>
      </div>
      <div class="product-button">
        <div class="button" @click="lookIntroduce(productList[0].code, productList[0].process_text)">查看流程</div>
        <div class="button" @click="showConfirm(productList[0].link, 0)">立即申请</div>
      </div>
    </div>
    <!-- 消息轮播区域 -->
    <div class="info">
      <img src="./../assets/img/CPS-H5_slices/红包素材 免抠 png.png" alt="">
      <van-swipe style="height: 30px;" vertical :autoplay="3000" loop :show-indicators='false' :height="30">
        <van-swipe-item v-for="item in userList" :key="item.id">{{item.text}}</van-swipe-item>
      </van-swipe>
    </div>
    <!-- 广告展示区域 -->
    <div class="ad-show">
      <ul>
        <li>
          <img src="./../assets/img/img_bjjr.png" alt="">
          <p>百家接入机构</p>
        </li>
        <li>
          <img src="./../assets/img/img_zntj.png" alt="">
          <p>智能推荐系统</p>
        </li>
        <li>
          <img src="./../assets/img/img_zytd.png" alt="">
          <p>专业客户团队</p>
        </li>
      </ul>
    </div>
    <!-- 模态框1-立即申请 -->
    <div class="model-one" v-show='modelOne'>
      <div class="dialog">
        <img src="./../assets/img/img_tc_01.png" alt="">
        <div class="choose">
          <p>感谢您的选择</p>
          <span>请注意只有一次选择机会哦</span>
          <div class="confirm" @click="confirm">确定</div>
          <div class="cancel" @click='cancel'>取消</div>
        </div>
      </div>
    </div>
    <!-- 模态框2-产看介绍 -->
    <div class="model-one" v-show='modelTwo'>
      <div class="dialog">
        <img src="./../assets/img/img_lcjs.png" alt="" class="img-second">
        <div class="introduce">
          <ul>
            <li v-for="item in process_text" :key='item.number'>
              <div class="number">
                <span>{{item.number}}</span>
                <p>{{item.title}}</p>
              </div>
              <p>{{item.content}}</p>
            </li>
          </ul>
          <div class="close" @click="close">×</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import { Swipe, SwipeItem } from 'vant'
import { productList, userList } from './../assets/data/productList'
import { maidianData } from './../assets/data/maidianData'
import { maidian, stringify, getAppUserData, convertSign, deepClone, getAppSign, convertCommonParam, openAppNewWeb } from './../tool/tools'
import { ajaxUrl } from '../ajax/ajaxApi'
import axios from '../ajax/ajaxConfig'

Vue.use(Swipe).use(SwipeItem)
export default {
  data () {
    return {
      productList: [
        {
          code: 'cps001',
          name: '国美易卡',
          img_src: './img/img_gm.png',
          intro_text: '额度高，下款快，合规持牌机构',
          link: 'https://jie.gomemyf.com/jie-h5/html/activity/flow-register-b.html?vendor=lixindai&fromSource=lixindai1',
          process_text: [
            {
              number: '01',
              title: '下载App',
              content: '苹果 App_Store 和安卓各大应用市场均可下载'
            },
            {
              number: '02',
              title: '手机号注册',
              content: '一定要用实名认证的手机号哦'
            },
            {
              number: '03',
              title: '身份核验',
              content: '包括：银行卡校对、手机号校对、身份证号码校对、人脸识别'
            }
          ]
        }],
      userList,
      modelOne: false,
      modelTwo: false,
      link: '',
      userInfo: {},
      maidianData: {},
      madidianList1: [
        { element_id: 'prod1_intro',
          element_event: 'click',
          element_content: '产品一查看点击事件'
        },
        { element_id: 'prod2_intro',
          element_event: 'click',
          element_content: '产品二查看点击事件'
        },
        { element_id: 'prod3_intro',
          element_event: 'click',
          element_content: '产品三查看点击事件'
        }
      ],
      madidianList2: [
        { element_id: 'prod1_apply',
          element_event: 'click',
          element_content: '产品一申请点击事件'
        },
        { element_id: 'prod2_apply',
          element_event: 'click',
          element_content: '产品二申请点击事件'
        },
        { element_id: 'prod3_apply',
          element_event: 'click',
          element_content: '产品三申请点击事件'
        }
      ],
      process_text: [
        {
          number: '01',
          title: '下载App',
          content: '苹果 App_Store 和安卓各大应用市场均可下载'
        },
        {
          number: '02',
          title: '手机号注册',
          content: '一定要用实名认证的手机号哦'
        },
        {
          number: '03',
          title: '身份核验',
          content: '包括：银行卡校对、手机号校对、身份证号码校对、人脸识别'
        }
      ],
      saveH5ProcessMap: {},
      startTime: '',
      text: {
        cps_text1: '曹女士：',
        cps_text2: "您已成功获得多家机构的贷款，成功率很高，特别是{'日期'}获得的{'机构'}一笔近{'金额'}的贷款，显示出您良好的信贷能力。根据我司大数据风控平台的计算，我们选出了您最有希望通过的{'推荐产品个数'}个产品，供您选择。"
      },
      map: {}
    }
  },
  methods: {
    confirm () { // 点击确认按钮
      this.modelOne = false
      // 保存h5节点
      let saveH5ProcessMap = convertCommonParam(this.userInfo)
      saveH5ProcessMap.productCode = this.userInfo.productCode
      saveH5ProcessMap.processCode = 'selection'
      saveH5ProcessMap.processName = '产品选择页'
      saveH5ProcessMap.url = window.location.href
      saveH5ProcessMap.html = this.link
      this.saveH5ProcessMap = saveH5ProcessMap
      getAppSign(this.saveH5Process, saveH5ProcessMap)
    },
    cancel () { // 点击取消按钮
      this.modelOne = false
      this.maidianData = {
        element_id: 'popup_no',
        element_event: 'click',
        element_content: '弹窗取消点击事件'
      }
      maidian(this.maidianData)
    },
    close () { // 关闭介绍
      this.modelTwo = false
    },
    lookIntroduce (code, text) { // 查看介绍流程
      maidian(maidianData[1])
      if (code === 'cps003') {
        // 及贷
        this.$router.push('jidai')
      } else if (code === 'cps004') {
        // 苏宁
        this.$router.push('suning')
      } else {
        this.process_text = text
        this.modelTwo = true
      }
      // maidian(this.madidianList1[index])
    },
    showConfirm (link, index) { // 立即申请
      // this.modelOne = true
      this.link = link
      // maidian(this.madidianList2[index])
      maidian(maidianData[2])
      // 取消模态框显示，保存h5节点
      let saveH5ProcessMap = convertCommonParam(this.userInfo)
      saveH5ProcessMap.productCode = this.userInfo.productCode
      saveH5ProcessMap.processCode = 'selection'
      saveH5ProcessMap.processName = '产品选择页'
      saveH5ProcessMap.url = window.location.href
      saveH5ProcessMap.html = this.link
      this.saveH5ProcessMap = saveH5ProcessMap
      getAppSign(this.saveH5Process, saveH5ProcessMap)
    },
    getUserInfo (userInfo) { // 获取用户信息回调
      this.userInfo = userInfo
      this.text = stringify(this.userInfo.productExtendContent) // 转换为对象
      console.log(this.userInfo)
      // 调用db
      getAppSign(this.queryDb, convertCommonParam(this.userInfo))
      // if (this.userInfo.productCode2Class) {
      //   let list = stringify(this.userInfo.productCode2Class)
      //   list.forEach(v => {
      //     productList.forEach(item => {
      //       if (item.code === v) {
      //         this.productList.push(item)
      //       }
      //     })
      //   })
      //   this.productList = this.productList.slice(1)
      // }
    },
    queryDb (sign) {
      let map = convertCommonParam(this.userInfo)
      map.md5sign = convertSign(sign)
      axios({
        url: ajaxUrl.rootUrl + ajaxUrl.queryDbStatus,
        method: 'post',
        params: map,
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
      })
        .then(res => {
          if (res.data.retcode === 1000) {
            console.log(res)
            if (res.data.data.ALLOWB.decisionBResult === 1) {
              // db结果成功后跳转结果页面
              let productCode = res.data.data.PASSINGB.productCode
              this.productList = productList.filter(v => v.code === productCode)
            } else if (res.data.data.ALLOWB.decisionBResult === 0) {
              this.$router.replace('/resultFail')
            }
          } else {
            if (res.retmsg) {
              console.log(res.retmsg)
            }
          }
        })
        .catch(err => console.log(err))
    },
    saveH5Process (sign) { // 保存h5流程节点
      let saveH5ProcessMap = deepClone(this.saveH5ProcessMap)
      saveH5ProcessMap.md5sign = convertSign(sign)
      axios({
        url: ajaxUrl.rootUrl + ajaxUrl.saveH5Process,
        method: 'post',
        params: saveH5ProcessMap,
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
      }).then(res => {
        if (res.data.retcode === 1000) {
          maidian(maidianData[3])
          this.$router.replace('/over')
          openAppNewWeb(this.link)
        } else {
          if (res.retmsg) {
            console.log(res.retmsg)
          }
        }
      }
      ).catch(
        err => console.log(err)
      )
    }
  },
  created () {
    window.getUserInfo = this.getUserInfo // 用户信息回调函数挂载到window上（ios回调）
    window.getSign = this.getSign
    window.saveH5Process = this.saveH5Process
    window.queryDb = this.queryDb
    getAppUserData(this.getUserInfo) // 传入回调函数
    document.querySelector('title').innerText = '审核结果'
  },
  beforeDestroy () { // 跳转链接报存到本地
    localStorage.link = this.link
  },
  mounted () {
    // maidian(maidianData)
    maidian(maidianData[0])
  }
}
</script>

<style lang="scss" scoped>
.selection {
  width: 100%;
  height: 100%;
  overflow: scroll;
  background-color: #FDB218;
}
.banner {
  img {
    width: 100%;
    height: auto;
    display: block;
  }
  .banner-text {
    position: relative;
    .text {
      position: absolute;
      top: 0px;
      left: 0px;
      padding: 10px 30px;
      color: #fff;
      font-size: 14px;
      line-height: 22px;
      color: #281C04;
      .text-con {
        text-indent: 2em;
      }
    }
  }
}
.product {
  padding: 0px 15px;
  ul {
    li {
      width: 100%;
      height: 74px;
      background: rgba(255,255,255,1);
      box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.06);
      margin-bottom: 15px;
      padding-left: 74px;
      padding-right: 100px;
      position: relative;
      img {
        position: absolute;
        top: 2px;
        left: 2px;
        width: 70px;
      }
      .word {
        .word-t {
          font-family: PingFang SC;
          font-weight: 500;
          color: #000;
          line-height: 30px;
        }
        .word-m {
          font-size: 11px;
          font-family: PingFang SC;
          font-weight: 400;
          color: rgba(102,102,102,1);
          line-height: 15px;
        }
        .word-b {
          font-size: 12px;
          font-family: PingFang SC;
          font-weight: 500;
          color: rgba(255,180,0,1);
          line-height: 30px;
        }
      }
      .link {
        position: absolute;
        top: 25px;
        right: 15px;
        width: 70px;
        height: 24px;
        line-height: 24px;
        background:rgba(54,102,253,1);
        border-radius:24px;
        font-size: 12px;
        text-align: center;
        color: #fff;
      }
    }
  }
}
.product-new {
  margin-bottom: 20px;
  position: relative;
  img {
    width: 100%;
  }
  .product-content {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0px;
    left: 0px;
    text-align: center;
    // padding-top: 20%;
    img {
      width: 28%;
      position: absolute;
      top:35%;
      left: 50%;
      transform: translate(-50%, -50%);
    }
    div.title {
      width: 100%;
      position: absolute;
      top: 60%;
      font-size: 23px;
      font-weight: 700;
      color: rgba(233,137,52,1);
      line-height: 22px;
      p {
        position: absolute;
        top: 30px;
        left: 50%;
        width: 30px;
        height: 4px;
        background-color: #E98934;
        border-radius: 2px;
        transform: translateX(-50%);
      }
    }
    p.content {
      width: 100%;
      position: absolute;
      top: 72%;
      font-size: 16px;
      // font-weight: 700;
      color: rgba(110,49,0,1);
      line-height: 16px;
    }
  }
  .product-button {
    position: relative;
    z-index: 99;
    padding: 0px 35px;
    display: flex;
    justify-content: space-between;
    .button {
      height: 44px;
      width: 135px;
      background:linear-gradient(0deg,rgba(246,80,56,1),rgba(253,156,61,1));
      box-shadow:0px 0px 8px 0px rgba(229,75,0,0.72);
      border-radius: 22px;
      color: #fff;
      line-height: 44px;
      text-align: center;
      font-size: 16px;
    }
  }
}
.info {
  height: 30px;
  // background: rgba(54,102,253,0.08);
  // box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.06);
  // opacity: 0.08;
  text-align: center;
  line-height: 30px;
  font-weight: 400;
  color:rgba(62,62,62,1);
  // margin: 30px 0px;
  font-size: 12px;
  padding-left: 20px;
  position: relative;
  img {
    width: 40px;
    height: auto;
    position: absolute;
    top: -7px;
    left: 10px;
    z-index: 999;
  }
  .van-swipe {
    width: 95%;
    border-radius: 15px;
    background-color: #6E3100;
    color: #fff;
    font-size: 12px;
    text-indent: 20px;
  }
}
.ad-show {
  ul {
    display: flex;
    justify-content: space-around;
    padding: 10px 0px 20px;
    background: #FDB218;
    // box-shadow:0px -2px 10px 0px rgba(0, 0, 0, 0.06);
    li {
      text-align: center;
      font-size: 14px;
      color: #fff;
      img {
        width: 64px;
        height: auto;
      }
    }
  }
}
.model-one {
  position: fixed;
  z-index: 999;
  top: 0px;
  left: 0px;
  width: 100%;
  height: 100%;
  background:rgba(0,0,0,0.8);
  .dialog {
    position: relative;
    width: 315px;
    margin: 0 auto;
    top: 150px;
    left: 0;
    img {
      width: 100%;
    }
    .choose {
      width: 100%;
      position: absolute;
      top: 165px;
      left: 0px;
      text-align: center;
      p {
        font-size: 24px;
        font-family: PingFang SC;
        font-weight: bold;
        color: rgba(66,66,66,1);
        line-height: 33px;
      }
      span {
        color: #777;
        font-size: 14px;
      }
      .confirm {
        width: 110px;
        height: 45px;
        position: absolute;
        bottom: -80px;
        left: 33px;
        background: rgba(66,66,66,1);
        border-radius: 4px;
        color: #fff;
        font-size: 18px;
        line-height: 45px;
      }
        .cancel {
        width: 110px;
        height: 45px;
        position: absolute;
        bottom: -80px;
        right: 33px;
        border-radius: 4px;
        border: 1px solid rgba(66,66,66,1);
        color: #424242;
        line-height: 45px;
        font-size: 18px;
      }
    }
    .introduce {
      width: 100%;
      position: absolute;
      top: 60px;
      left: 0px;
      background-color: #fff;
      border-radius: 4px 4px 10px 10px;
      ul {
        margin-top: 30px;
        li {
          position: relative;
          padding: 30px 20px 0px 60px;
          font-size: 12px;
          margin-bottom: 30px;
          .number {
            padding-left: 15px;
            position: absolute;
            left: 30px;
            top: 0px;
            color: #fff;
            font-size: 18px;
            span {
              width: 26px;
              height: 26px;
              background-color: #444444;
              border-radius: 50%;
              line-height: 26px;
              text-align: center;
              border: 2px solid #fff;
              position: absolute;
              top: -2px;
              left: 0px;
            }
            p {
              padding:0px 20px;
              height: 26px;
              background-color: #FFB400;
              line-height: 26px;
              border-radius: 13px;
            }
          }
          p {
            font-size: 12px;
          }
        }
      }
    }
    .img-second {
      width: 90%;
      position: relative;
      left: 5%;
    }
    .close {
      width: 36px;
      height: 36px;
      border-radius: 50%;
      color: #fff;
      border: 1px solid #fff;
      line-height: 30px;
      text-align: center;
      font-size: 36px;
      position: absolute;
      bottom: -50px;
      left: 140px;
    }
  }
}
</style>
