<template>
  <div class="decoration">
    <!-- 内容区域 -->
    <div class="content">
      <div class="content-t">
      </div>
      <div class="content-c">
        <ul>
          <li @click="toNext('decoration')">
            <div class="product">
              <img :src="productList[1].img_src" alt="">
            </div>
          </li>
        </ul>
      </div>
    </div>
    <!-- 表单区域 -->
    <div class="question">
      <van-cell-group>
        <van-field v-model="content[0].value2"  label="购车省市："  placeholder="请选择购车省市" />
        <van-field v-model="content[1].value2"  label="类型："  placeholder="请选择购车类型" />
        <van-field v-model="content[2].value2"  label="品牌："  placeholder="请选择购车品牌" />
        <van-field v-model="content[3].value2"  label="车价："  placeholder="请选择购车价格" />
        <van-field v-model="content[4].value2"  label="型号："  placeholder="请填写具体型号(选填)" />
      </van-cell-group>
      <div class="choose" @click="() => {this.actionSheet[0].show = true}"></div>
      <div class="choose" @click="() => {this.actionSheet[1].show = true}" style="top: 44px"></div>
      <div class="choose" @click="() => {this.actionSheet[2].show = true}" style="top: 88px"></div>
      <div class="choose" @click="() => {this.actionSheet[3].show = true}" style="top: 132px"></div>
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
      <!-- 购车类型 -->
      <van-action-sheet v-model="actionSheet[1].show" :actions="actionSheet[1].actions" @select="onSelect1" :lock-scroll='false' />
      <!-- 购车品牌 -->
      <van-action-sheet v-model="actionSheet[2].show" :actions="actionSheet[2].actions" @select="onSelect2" :lock-scroll='false' />
      <!-- 购车价位 -->
      <van-action-sheet v-model="actionSheet[3].show" :actions="actionSheet[3].actions" @select="onSelect3" :lock-scroll='false' />
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
          subjectName: '购车省市',
          value1: '',
          value2: ''
        },
        {
          key: 'zzhc002',
          subjectName: '类型',
          value1: '',
          value2: ''
        },
        {
          key: 'zzhc003',
          subjectName: '品牌',
          value1: '',
          value2: ''
        },
        {
          key: 'zzhc004',
          subjectName: '车价',
          value1: '',
          value2: ''
        },
        {
          key: 'zzhc005',
          subjectName: '型号【可选】',
          value1: '',
          value2: ''
        }
      ],
      actionSheet: [
        { show: false },
        { show: false,
          actions: [{ name: '轿车' },
            { name: 'SUV' },
            { name: 'MPV' },
            { name: '面包车' },
            { name: '货车' }
          ]
        },
        { show: false,
          actions: [{ name: '请选择购车类型' }
          ]
        },
        { show: false,
          actions: [{ name: '3万以下' },
            { name: '3-5万' },
            { name: '5-8万' },
            { name: '8-10万' },
            { name: '10-15万' },
            { name: '15-20万' },
            { name: '20-30万' },
            { name: '30-45万' },
            { name: '45万以上' }
          ]
        }
      ],
      areaList
    }
  },
  methods: {
    getUserInfo (userInfo) {
      this.userInfo = userInfo
    },
    submit () {
      let arr = this.content.slice(0, 4)
      if (arr.some(item => item.value2.length === 0)) {
        return Toast('请确认信息填写完整')
      }
      // 非空验证通过
      let saveH5ProcessMap = {}
      saveH5ProcessMap = convertCommonParam(this.userInfo)
      saveH5ProcessMap.productCode = this.userInfo.productCode
      saveH5ProcessMap.processCode = `buyCar`
      saveH5ProcessMap.processName = '周周花消费卡买车页'
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
            console.log('buyCar保存节点成功')
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
          console.log('buyCar保存数据成功')
          window.localStorage.setItem('resultType', '购车分期方案')
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
      this.actionSheet[1].show = false
      this.content[1].value2 = item.name
      if (item.name === '轿车' || item.name === 'SUV' || item.name === 'MPV') {
        this.actionSheet[2].actions = [ { name: '大众' }, { name: '本田' }, { name: '奔驰' }, { name: '丰田' }, { name: '别克' }, { name: '日产' }, { name: '宝马' }, { name: '奥迪' }, { name: '福特' }, { name: '现代' }, { name: '起亚' }, { name: '马自达' }, { name: '哈弗' }, { name: '雪佛兰' }, { name: '吉利' }, { name: '其他' } ]
      } else if (item.name === '面包车') {
        this.actionSheet[2].actions = [ { name: '五菱' }, { name: '长安汽车' }, { name: '金杯汽车' }, { name: '东风小康' }, { name: '北汽威旺' }, { name: '昌河汽车' }, { name: '一汽佳宝' }, { name: '福田汽车' }, { name: '开瑞汽车' }, { name: '福汽启腾' }, { name: '其他' } ]
      } else {
        this.actionSheet[2].actions = [ { name: '一汽解放' }, { name: '福田欧曼' }, { name: '中国重汽' }, { name: '江淮汽车' }, { name: '江铃汽车' }, { name: '上汽跃进' }, { name: '大运重卡' }, { name: '四川现代' }, { name: '青岛解放' }, { name: '东风商用' }, { name: '解放轻卡' }, { name: '奔驰卡车' }, { name: '东风柳汽' }, { name: '广汽日野' }, { name: '上汽红岩' }, { name: '欧马可' }, { name: '多利卡' }, { name: '联合卡车' }, { name: '飞碟奥驰' }, { name: '依维柯' }, { name: '江淮骏铃' }, { name: '福田奥铃' }, { name: '福田时代' }, { name: '陕汽重卡' }, { name: '斯堪尼亚' }, { name: '豪沃轻卡' }, { name: '江淮康铃' }, { name: '其他' } ]
      }
    },
    onSelect2 (item) {
      this.actionSheet[2].show = false
      this.content[2].value2 = item.name
    },
    onSelect3 (item) {
      this.actionSheet[3].show = false
      this.content[3].value2 = item.name
    }
  },
  created () {
    window.getUserInfo = this.getUserInfo
    window.saveH5Process = this.saveH5Process
    window.saveH5Data = this.saveH5Data
    getAppUserData(this.getUserInfo)
    document.title = '买车'
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
  padding: 0px 20px;
  position: relative;
  .choose {
    width: 100%;
    height: 44px;
    position: absolute;
    top: 0px;
    z-index: 2;
  }
  .unit {
    width: 140px;
    height: 44px;
    background-color: #fff;
    line-height: 44px;
    position: absolute;
    top: 44px;
    right: 0px;
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
