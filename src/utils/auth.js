import Cookies from 'js-cookie'

const TokenKey = 'Admin-Token'
const AuthHostKey = 'Auth-Host'

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}

export function getAuthHost() {
  return Cookies.get(AuthHostKey)
}

export function setAuthHost(token) {
  return Cookies.set(AuthHostKey, token)
}

export function removeAuthHost() {
  return Cookies.remove(AuthHostKey)
}
