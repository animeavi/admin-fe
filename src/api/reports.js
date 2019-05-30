import request from '@/utils/request'
import { getToken } from '@/utils/auth'
import { baseName } from './utils'

export async function changeState(state, id, authHost, token) {
  return await request({
    baseURL: baseName(authHost),
    url: `/api/pleroma/admin/reports/${id}`,
    method: 'put',
    headers: authHeaders(token),
    data: { state }
  })
}

export async function changeStatusScope(id, sensitive, visibility, authHost, token) {
  return await request({
    baseURL: baseName(authHost),
    url: `/api/pleroma/admin/statuses/${id}`,
    method: 'put',
    headers: authHeaders(token),
    data: { sensitive, visibility }
  })
}

export async function deleteStatus(id, authHost, token) {
  return await request({
    baseURL: baseName(authHost),
    url: `/api/pleroma/admin/statuses/${id}`,
    method: 'delete',
    headers: authHeaders(token)
  })
}

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
