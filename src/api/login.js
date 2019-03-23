import request from '@/utils/request'
import { baseName } from './utils'

export async function loginByUsername(username, password, authHost) {
  const appsRequest = await request({
    baseURL: baseName(authHost),
    url: '/api/v1/apps',
    method: 'post',
    data: {
      client_name: `AdminFE_${Math.random()}`,
      redirect_uris: `${window.location.origin}/oauth-callback`,
      scopes: 'read write follow'
    }
  })

  const app = appsRequest.data

  return request({
    baseURL: baseName(authHost),
    url: '/oauth/token',
    method: 'post',
    data: {
      client_id: app.client_id,
      client_secret: app.client_secret,
      grant_type: 'password',
      username: username,
      password: password
    }
  })
}

export function getUserInfo(token, authHost) {
  return request({
    baseURL: baseName(authHost),
    url: '/api/account/verify_credentials',
    method: 'post',
    headers: token ? { 'Authorization': `Bearer ${token}` } : {}
  })
}

const oauth = { loginByUsername, getUserInfo }

export default oauth
