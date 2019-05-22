import request from '@/utils/request'
import { getToken } from '@/utils/auth'
import { baseName } from './utils'

export async function fetchReports(limit, max_id, authHost, token) {
  return await request({
    baseURL: baseName(authHost),
    url: `/api/pleroma/admin/reports?limit=${limit}&max_id=${max_id}`,
    method: 'get',
    headers: authHeaders(token)
  })
}

export async function filterReports(filter, limit, max_id, authHost, token) {
  return await request({
    baseURL: baseName(authHost),
    url: `/api/pleroma/admin/reports?state=${filter}&limit=${limit}&max_id=${max_id}`,
    method: 'get',
    headers: authHeaders(token)
  })
}

const authHeaders = (token) => token ? { 'Authorization': `Bearer ${getToken()}` } : {}
