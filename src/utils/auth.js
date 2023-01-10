import Cookies from 'js-cookie'

const TokenKey = 'vue_admin_template_token'
const TimeStamp='vue_admin_template_timestamp'

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token,date) {
	setTime()
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}
export function setTime(){
	return Cookies.set(TimeStamp,Date.now())
}
export function getTime(){
	
	return cookies.get(timeStamp)
}
