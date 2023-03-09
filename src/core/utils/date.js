// 用来处理时间

// 日期转换
export function timeFormat(value, format) {
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

export function formatType(type, format, value, regExpAttributes) {
  const regExpMap = {
    year: '(Y+)',
    month: '(M+)',
    date: '(D+)',
    hour: '(h+)',
    minute: '(m+)',
    second: '(s+)',
    quarter: '(q+)',
    millisecond: '(S)'
  }

  if (new RegExp(regExpMap[type], regExpAttributes).test(format)) {
    const replaceStr = type === 'year'
      ? value.toString().substr(4 - RegExp.$1.length)
      : (RegExp.$1.length === 1)
        ? value
        : pad(value)
    // eslint-disable-next-line no-param-reassign
    format = format.replace(RegExp.$1, replaceStr)
  }

  return format
}

// 获得当前日期时间
export function getCurrentTime() {
  const date = new Date()
  let mon = date.getMonth() + 1
  if (mon <= 9) {
    mon = '0' + mon
  }
  let day = date.getDate()
  if (day <= 9) {
    day = '0' + day
  }
  let hour = date.getHours()
  if (hour <= 9) {
    hour = '0' + hour
}
  let minute = date.getMinutes()
  if (minute <= 9) {
  minute = '0' + minute
}
  let second = date.getSeconds()
  if (second <= 9) {
  second = '0' + second
}
return date.getFullYear() + '-' + mon + '-' + day + ' ' + hour + ':' + minute + ':' + second
}

function pad(value) {
  return ('00' + value).substr(('' + value).length)
}

/**
 * 通过传入的日期获取之后的月份
 * @param date yyyy-MM-dd
 * @param monthNum 多少月后
 * @returns {string}
 */
export function getNextMonth(date, monthNum) {
  const dateArr = date.split('-')
  const year = dateArr[0] // 获取当前日期的年份
  const month = dateArr[1] // 获取当前日期的月份
  let year2 = year
  let month2 = parseInt(month) + parseInt(monthNum)
  if (month2 > 12) {
    year2 = parseInt(year2) + parseInt((parseInt(month2) / 12 === 0 ? 1 : parseInt(month2) / 12))
    month2 = parseInt(month2) % 12
  }
  if (month2 < 10) {
    month2 = '0' + month2
  }
  return year2 + '-' + month2
}
