/**
 * Created by deepsky on 2017/3/8.
 */
import * as dictionaries from './dictionaries'

const leaveTypeDic = dictionaries.leaveType()
const temporaryType = dictionaries.temporaryType()
exports.leaveType = () => {
  return leaveTypeDic
}
exports.applyType = () => {
  return [
    {
      code: 'BUSINESS_TRIP',
      name: '安排出差'
    },
    {
      code: 'TEMPORARY_WORK_OVERTIME',
      name: '安排临时加班'
    }
  ]
}

exports.temporaryType = () => {
  return temporaryType
}
// 类型字典转换
exports.changeType = (str) => {
  let result = null
  for (let type of leaveTypeDic) {
    if (type.name === str) {
      return str
    }
    if (type.id === str) {
      result = type.name
      break
    }
  }
  return result
}
// 转换休假单位
exports.changeLeaveUnit = (leaveQuota, leaveType, unit) => {
  let result = null
  for (let type of leaveTypeDic) {
    if (type.id === leaveType || type.name === leaveType) {
      if (type.unit === 'day') {
        result = unit ? (leaveQuota / 8) + '天' : leaveQuota / 8
      } else {
        result = unit ? leaveQuota + '小时' : leaveQuota
      }
    }
  }
  return result
}
// 判断是否是一次性取假类型
exports.isOneOffLeave = (leaveType) => {
  let result = null
  for (let type of leaveTypeDic) {
    if (type.id === leaveType || type.name === leaveType) {
      if (type.ontOff) {
        result = true
      } else {
        result = false
      }
    }
  }
  return result
}
// 转换申请类型
exports.switchApplyType = (str) => {
  let result = null
  for (let type of exports.applyType()) {
    if (type.name === str) {
      return str
    }
    if (type.id === str) {
      result = type.name
      break
    }
  }
  return result
}

// 转换申请细类
exports.switchTemporaryType = (str) => {
  let result = null
  for (let type of exports.temporaryType()) {
    if (type.name === str) {
      return str
    }
    if (type.id === str) {
      result = type.name
      break
    }
  }
  return result
}

export function isArray (arr) {
  return isType(arr, 'Array')
}

export function isObject (obj) {
  return isType(obj, 'Object')
}

export function isFunction (fn) {
  return isType(fn, 'Function')
}
export function isEmpty (obj) {
  if (!obj) {
    return true
  }
  if (isArray(obj) && obj.length === 0) {
    return true
  }
  if (isObject(obj) && Object.keys(obj).length === 0) {
    return true
  }
  return false
}

export function isType (obj, type) {
  return Object.prototype.toString.call(obj) === '[object ' + type + ']'
}
export function fmtDate (date, fmt) {
  // 简单粗暴一点
  let reg = /^\d{4}(-|[\u4e00-\u9fa5])\d{1,2}(-|[\u4e00-\u9fa5])\d{1,2}/
  if (reg.test(date)) {
    date = new Date(date.replace(/-|[\u4e00-\u9fa5]/g, '/'))
  }
  date = new Date(date)
  let o = {
    'M+': date.getMonth() + 1, // 月份
    'd+': date.getDate(), // 日
    'h+': date.getHours(), // 小时
    'm+': date.getMinutes(), // 分
    's+': date.getSeconds(), // 秒
    'q+': Math.floor((date.getMonth() + 3) / 3), // 季度
    'S': date.getMilliseconds(), // 毫秒
    'T': ['日', '一', '二', '三', '四', '五', '六'][date.getDay()]
  }
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
  }
  for (var k in o) {
    if (new RegExp('(' + k + ')').test(fmt)) {
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)))
    }
  }
  return fmt
}
export function findId (arr, id, name, str) {
  let temp
  for (let index in arr) {
    if (arr[index][name] === str) {
      temp = arr[index][id]
      break
    }
  }
  return temp
}
export function sortBy (array, string, reverse = false) {
  array.sort((a, b) => {
    if (reverse) {
      return a[string] > b[string] ? 1 : -1
    } else {
      return a[string] <= b[string] ? 1 : -1
    }
  })
}
export function pluck (array, key) {
  let temp = []
  Array.isArray(array) && array.forEach(v => {
    if (v[key] !== undefined) {
      temp.push(v[key])
    }
  })
  return temp
}
exports.getDate = (duration) => {
  let now = new Date()
  let newDateString = ''
  if (duration) {
    let interval = duration * 24 * 60 * 60 * 1000
    let newDate = new Date(now.getTime() + interval)
    newDateString = fmtDate(newDate, 'yyyy-MM-dd')
  } else {
    newDateString = fmtDate(now, 'yyyy-MM-dd')
  }
  return newDateString
}
