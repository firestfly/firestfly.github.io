import * as utils from './utils/util.js'

exports.cutMinute = (str) => {
  return str && str.slice(0, -3)
}
exports.date = (str, format) => {
  return utils.fmtDate(str, format)
}
exports.filterLeaveType = (str) => {
  return utils.changeType(str)
}
exports.filterLeaveUnit = (leaveQuota, leaveType, unit) => {
  return utils.changeLeaveUnit(leaveQuota, leaveType, unit)
}
exports.filterTemporaryType = (str) => {
  return utils.switchTemporaryType(str)
}
