import request from '@/utils/request'
import { getToken } from '@/utils/auth'
import { baseName } from './utils'

export async function listBannedUrls(page, pageSize, authHost, token) {
  return await request({
    baseURL: baseName(authHost),
    url: `/api/pleroma/admin/media_proxy_caches?page=${page}&page_size=${pageSize}`,
    method: 'get',
    headers: authHeaders(token)
  })
}

export async function purgeUrls(urls, ban, authHost, token) {
  return await request({
    baseURL: baseName(authHost),
    url: `/api/pleroma/admin/media_proxy_caches/purge`,
    method: 'post',
    headers: authHeaders(token),
    data: { urls, ban }
  })
}

export async function removeBannedUrls(urls, authHost, token) {
  return await request({
    baseURL: baseName(authHost),
    url: `/api/pleroma/admin/media_proxy_caches/delete`,
    method: 'post',
    headers: authHeaders(token),
    data: { urls }
  })
}

const authHeaders = (token) => token ? { 'Authorization': `Bearer ${getToken()}` } : {}
