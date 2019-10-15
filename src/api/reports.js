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

export async function fetchGroupedReports(authHost, token) {
  return await request({
    baseURL: baseName(authHost),
    url: `/api/pleroma/admin/grouped_reports`,
    method: 'get',
    headers: authHeaders(token)
  })
}

const authHeaders = (token) => token ? { 'Authorization': `Bearer ${getToken()}` } : {}
