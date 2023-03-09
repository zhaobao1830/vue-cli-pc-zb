// 对请求参数进行处理
import Config from '@/core/config'
import apiServiceConfig from '@/core/config/apiService'
import CryptoJs from 'crypto-js'
import _axios from 'axios'

import { Base64 } from 'js-base64'

export default class Parameter {
  // 对参数value值进行处理，数组变成字符串
  static getSigns(paramArray) {
    let newParam = ''
    if (Object.prototype.toString.call(paramArray) === '[object Array]' && paramArray.length > 0) {
      newParam = paramArray.join('&')
    } else {
      return ''
    }
    return newParam
  }

  // 加密
  static async encryption(sign, datas) {
    // 获得当前时间毫秒数
    const times = (new Date()).getTime()
    // 获得随机数
    const randomWords = this.randomWord()
    // 获取签名密匙
    const p_key = await this.signatureKey()
    const signs = Base64.encode(CryptoJs.HmacSHA1(sign + '&' + times + '&' + randomWords, p_key).toString())
    const dataOther = {
      sign: signs,
      timeStamp: times,
      randNumber: randomWords
    }
    return Base64.encode(JSON.stringify(Object.assign(datas, dataOther)))
  }

  // 获取随机数
  static randomWord() {
    let str = ''
    const range = 10
    const arrList = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l',
      'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I',
      'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'
    ]
    // 随机产生
    for (let i = 0; i < range; i++) {
      const pos = Math.round(Math.random() * (arrList.length - 1))
      str += arrList[pos]
    }
    return str
  }

  static async signatureKey() {
    let key = ''
    const signKeyVal = JSON.parse(localStorage.getItem('signKey'))
    if (signKeyVal !== null && signKeyVal.signKey !== null && signKeyVal.signKey.length > 0) {
      const request = signKeyVal.expire // - 30 * 60 * 1000; // 到期时间-30分钟
      const now = Date.now()
      if (now < request) {
        key = signKeyVal.signKey
        return key
      }
    }
    const obj = {
      appId: '11994949494988888888888888888888'
    }
    const objStr = JSON.stringify(obj)
    const base64Str = Base64.encode(objStr)
    const res = await this.getSignKey(base64Str)
    const resData = res.data
    if (resData.success === 0) {
      if (resData.data.signKey) {
        key = resData.data.signKey
        const param = {
          signKey: key,
          expire: resData.data.expire,
          expireDate: resData.data.expireDate
        }
        localStorage.setItem('signKey', JSON.stringify(param))
      } else {
        key = resData.data
      }
      return key
    }
  }

  // 获取SignKey值
  static async getSignKey(base64Str) {
    return _axios({
      method: 'post',
      headers: {
        'content-type': 'application/json;charset=UTF-8'
      },
      url: Config.baseUrl + apiServiceConfig.getPKey,
      data: base64Str
    })
  }
}
