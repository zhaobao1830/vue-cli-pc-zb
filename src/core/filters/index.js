// 全局过滤器
import { formatType } from '@/core/utils/date'

const filters = {
  /**
   * 日期过滤器
   * @param value 日期
   * @param format 日期类型
   * @returns {*}
   */
  timeFormatFilter: (value, format) => {
    if (value) {
      const date = new Date(value)
      const map = {
        year: {
          value: date.getFullYear(),
          regExpAttributes: 'i'
        },
        month: {
          value: date.getMonth() + 1
        },
        date: {
          value: date.getDate(),
          regExpAttributes: 'i'
        },
        hour: {
          value: date.getHours(),
          regExpAttributes: 'i'
        },
        minute: {
          value: date.getMinutes()
        },
        second: {
          value: date.getSeconds()
        },
        quarter: {
          value: Math.floor((date.getMonth() + 3) / 3),
          regExpAttributes: 'i'
        },
        millisecond: {
          value: date.getMilliseconds()
        }
      }

      for (const key in map) {
        // eslint-disable-next-line no-param-reassign
        format = formatType(key, format, map[key].value, map[key].regExpAttributes)
      }

      return format
    }
  }
}

export default filters
