<template>
  <div class="decoration">
    <!-- 内容区域 -->
    <div class="content">
      <div class="content-t">
      </div>
      <div class="content-c">
        <ul>
          <li>
            <div class="product">
              <img :src="productList[0].img_src" alt="">
              <img src="./../assets/img/家装流程.png" alt="">
            </div>
          </li>
        </ul>
      </div>
    </div>
    <!-- 表单区域 -->
    <div class="question">
      <van-cell-group>
        <van-field v-model="content[0].value2"  label="所在省市："  placeholder="请选择所在省市" />
        <van-field readonly clickable v-model="content[1].value2" @click="() => {this.actionSheet[1].show = true}" label="房屋面积："  placeholder="请输入房屋面积"/>
        <van-field v-model="content[2].value2"  label="房屋类型："  placeholder="请选择房屋类型" />
        <van-field v-model="content[3].value2"  label="户型："  placeholder="请选择户型" />
      </van-cell-group>
      <div class="choose" @click="() => {this.actionSheet[0].show = true}"></div>
      <div class="choose" @click="() => {this.actionSheet[2].show = true}" style="top: 88px"></div>
      <div class="choose" @click="() => {this.actionSheet[3].show = true}" style="top: 132px"></div>
      <div class="unit">平方米</div>
    </div>
    <div class="submit">
      <van-button type="info" @click="submit">下一步</van-button>
    </div>
    <!-- 上拉菜单 -->
    <div class="actionSheet">
      <!-- 地区选择 -->
      <van-action-sheet v-model="actionSheet[0].show" :lock-scroll='false'>
        <van-area :area-list="areaList" :visible-item-count='5' cancel-button-text=' ' confirm-button-text=' ' @change='confirmArea' title="选择地区"/>
      </van-action-sheet>
      <!-- 数字键盘 -->
      <van-action-sheet v-model="actionSheet[1].show" :lock-scroll='false'>
        <van-number-keyboard v-model="content[1].value2" :show="this.actionSheet[1].show" :maxlength="4" @blur="() => {this.actionSheet[1].show = false}" />
      </van-action-sheet>
      <!-- 房屋类型 -->
      <van-action-sheet v-model="actionSheet[2].show" :actions="actionSheet[2].actions" @select="onSelect1" :lock-scroll='false' />
      <!-- 装修-户型选择 -->
      <van-action-sheet v-model="actionSheet[3].show">
        <div class="picker" >
          <p style="height:44px; text-align: center; line-height: 44px;">选择户型</p>
          <van-picker :columns="columns" :visible-item-count='3' @change='pickerChange'/>
        </div>
      </van-action-sheet>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import { ajaxUrl } from '../ajax/ajaxApi'
import axios from '../ajax/ajaxConfig'
import { getAppUserData, getAppSign, convertSign, convertCommonParam } from '../tool/tools'
import areaList from './../assets/data/area'
import { productList } from './../assets/data/productList'
import { Toast } from 'vant'

Vue.use(Toast)
export default {
  data () {
    return {
      userInfo: {},
      saveH5ProcessMap: {},
      saveDataMap: {},
      productList,
      content: [
        {
          key: 'zzhc001',
          subjectName: '所在省市',
          value1: '',
          value2: ''
        },
        {
          key: 'zzhc002',
          subjectName: '房屋面积',
          value1: '',
          value2: ''
        },
        {
          key: 'zzhc003',
          subjectName: '房屋类型',
          value1: '',
          value2: ''
        },
        {
          key: 'zzhc004',
          subjectName: '所在户型',
          value1: '',
          value2: ''
        }
      ],
      actionSheet: [
        { show: false },
        { show: false },
        { show: false,
          actions: [{ name: '新房' },
            { name: '老房/二手房' }
          ]
        },
        { show: false }
      ],
      areaList,
      columns: [
        {
          values: ['一室', '两室', '三室', '四室', '五室', '六室', '以上'],
          className: 'column1',
          defaultIndex: 1
        },
        {
          values: ['一厅', '两厅', '三厅', '四厅', '五厅', '六厅', '以上'],
          className: 'column2',
          defaultIndex: 0
        },
        {
          values: ['一卫', '两卫', '三卫', '四卫', '五卫', '六卫', '以上'],
          className: 'column2',
          defaultIndex: 0
        }
      ]
    }
  },
  methods: {
    getUserInfo (userInfo) {
      this.userInfo = userInfo
    },
    submit () {
      if (this.content.some(item => item.value2.length === 0)) {
        return Toast('请确认信息填写完整')
      }
      // 非空验证通过
      let saveH5ProcessMap = {}
      saveH5ProcessMap = convertCommonParam(this.userInfo)
      saveH5ProcessMap.productCode = this.userInfo.productCode
      saveH5ProcessMap.processCode = `decoration`
      saveH5ProcessMap.processName = '周周花消费卡品牌家装页'
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
            console.log('decoration保存节点成功')
            this.callbackSuccess(res.data.data) // 调保存h5数据接口
          } else {
            if (res.retmsg) {
              console.log(res.retmsg)
            }
          }
        })
        .catch(err => console.log(err))
    },
    callbackSuccess (data) {
      if (data) {
        this.processId = '' + data.id
        // 调用保存h5数据
        let saveH5DataMap = {}
        saveH5DataMap = convertCommonParam(this.userInfo)
        saveH5DataMap.productCode = this.userInfo.productCode
        saveH5DataMap.content = JSON.stringify(this.content)
        saveH5DataMap.processId = this.processId
        this.saveDataMap = saveH5DataMap
        getAppSign(this.saveH5Data, saveH5DataMap)
      } else {
        console.log('data不存在')
      }
    },
    saveH5Data (sign) {
      let map = this.saveDataMap
      map.md5sign = convertSign(sign)
      axios({
        url: ajaxUrl.rootUrl + ajaxUrl.saveH5Data,
        method: 'post',
        params: map,
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
      }).then(res => {
        if (res.data.retcode === 1000) {
          // 保存数据成功
          console.log('decoration保存数据成功')
          window.localStorage.setItem('resultType', '装修分期套餐')
          this.$router.replace(`matchResult1`)
        } else {
          if (res.retmsg) {
            console.log(res.retmsg)
          }
        }
      }).catch(err => console.log(err))
    },
    confirmArea (event, arr) {
      let list = []
      arr.forEach(v => {
        if (v) {
          list.push(v.name)
        }
      })
      this.content[0].value2 = list.join(',')
    },
    onSelect1 (item) {
      this.actionSheet[2].show = false
      this.content[2].value2 = item.name
    },
    pickerChange (event, value) {
      console.log(event)
      let string = value.join(',')
      this.content[3].value2 = string
    }
  },
  created () {
    window.getUserInfo = this.getUserInfo
    window.saveH5Process = this.saveH5Process
    window.saveH5Data = this.saveH5Data
    getAppUserData(this.getUserInfo)
    document.title = '品牌家装'
  }
}
</script>

<style lang="scss" scoped>
.content {
  padding: 0px 20px;
  .content-c {
    ul {
      li {
        margin: 10px 0px;
        position: relative;
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
.question {
  position: relative;
  padding: 0px 20px;
  .choose {
    width: 100%;
    height: 44px;
    position: absolute;
    top: 0px;
    z-index: 2;
  }
  .unit {
    width: 120px;
    height: 44px;
    background-color: #fff;
    line-height: 44px;
    position: absolute;
    top: 44px;
    right: 20px;
  }
}
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
