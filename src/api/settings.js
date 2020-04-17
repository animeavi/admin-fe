import request from '@/utils/request'
import { getToken } from '@/utils/auth'
import { baseName } from './utils'

export async function fetchDescription(authHost, token) {
  return await request({
    baseURL: baseName(authHost),
    url: `/api/pleroma/admin/config/descriptions`,
    method: 'get',
    headers: authHeaders(token)
  })
}

export async function fetchSettings(authHost, token) {
  return await request({
    baseURL: baseName(authHost),
    url: `/api/pleroma/admin/config`,
    method: 'get',
    headers: authHeaders(token)
  })
}

export async function updateSettings(configs, authHost, token) {
  return await request({
    baseURL: baseName(authHost),
    url: `/api/pleroma/admin/config`,
    method: 'post',
    headers: authHeaders(token),
    data: { configs }
  })
}

export async function removeSettings(configs, authHost, token) {
  return await request({
    baseURL: baseName(authHost),
    url: `/api/pleroma/admin/config`,
    method: 'post',
    headers: authHeaders(token),
    data: { configs }
  })
}

const authHeaders = (token) => token ? { 'Authorization': `Bearer ${getToken()}` } : {}
