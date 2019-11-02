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

export async function migrateToDB(authHost, token) {
  return await request({
    baseURL: baseName(authHost),
    url: `/api/pleroma/admin/config/migrate_to_db`,
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

export async function uploadMedia(file, authHost, token) {
  const formData = new FormData()
  formData.append('file', file)
  return await request({
    baseURL: baseName(authHost),
    url: `/api/v1/media`,
    method: 'post',
    headers: authHeaders(token),
    data: formData
  })
}

const authHeaders = (token) => token ? { 'Authorization': `Bearer ${getToken()}` } : {}
