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

export async function fetchReports(filter, page, pageSize, authHost, token) {
  const url = filter.length > 0
    ? `/api/pleroma/admin/reports?state=${filter}&page=${page}&page_size=${pageSize}`
    : `/api/pleroma/admin/reports?page=${page}&page_size=${pageSize}`
  return await request({
    baseURL: baseName(authHost),
    url,
    method: 'get',
    headers: authHeaders(token)
  })
}

const authHeaders = (token) => token ? { 'Authorization': `Bearer ${getToken()}` } : {}
