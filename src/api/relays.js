import request from '@/utils/request'
import { getToken } from '@/utils/auth'
import { baseName } from './utils'

export async function fetchRelays(authHost, token) {
  return await request({
    baseURL: baseName(authHost),
    url: '/api/pleroma/admin/relay',
    method: 'get',
    headers: authHeaders(token)
  })
}

export async function addRelay(relay, authHost, token) {
  return await request({
    baseURL: baseName(authHost),
    url: '/api/pleroma/admin/relay',
    method: 'post',
    headers: authHeaders(token),
    data: { relay_url: relay }
  })
}

export async function deleteRelay(relay, authHost, token) {
  return await request({
    baseURL: baseName(authHost),
    url: '/api/pleroma/admin/relay',
    method: 'delete',
    headers: authHeaders(token),
    data: { relay_url: `https://${relay}/actor` }
  })
}

const authHeaders = (token) => token ? { 'Authorization': `Bearer ${getToken()}` } : {}
