function getCookie (name) {
  let reg = new RegExp('(^| )' + name + '=([^;]*)(;|$)')
  let arr = document.cookie.match(reg)
  if (arr) {
    return unescape(arr[2])
  } else {
    return null
  }
}
function setCookie (name, value, day = 30) {
  let exp = new Date()
  exp.setTime(exp.getTime() + day * 24 * 60 * 60 * 1000)
  document.cookie = name + '=' + escape(value) + ';expires=' + exp.toGMTString()
}
function getQueryString (name) {
  var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)')
  var r = window.location.search.substr(1).match(reg)
  if (r != null) return decodeURI(r[2])
  return null
}
function getRMUser () {
  let userLoginMobile = getQueryString('loginMobile')
  let accessToken = getQueryString('token')
  let rmUser = {}
  if (userLoginMobile === null) {
    rmUser = JSON.parse(getCookie('rmUser'))
  } else {
    rmUser = {
      'loginMobile': userLoginMobile,
      'token': accessToken
    }
    setCookie('rmUser', JSON.stringify(rmUser))
  }
  return rmUser
}
export {getRMUser}
