import request from '@/utils/request'
import { getToken } from '@/utils/auth'
import { baseName } from './utils'

export async function fetchUsers(filters, authHost, token, page = 1) {
  return await request({
    baseURL: baseName(authHost),
    url: `/api/pleroma/admin/users?page=${page}&filters=${filters}`,
    method: 'get',
    headers: authHeaders(token)
  })
}

export async function toggleUserActivation(nickname, authHost, token) {
  return await request({
    baseURL: baseName(authHost),
    url: `/api/pleroma/admin/users/${nickname}/toggle_activation`,
    method: 'patch',
    headers: authHeaders(token)
  })
}

export async function searchUsers(query, filters, authHost, token, page = 1) {
  return await request({
    baseURL: baseName(authHost),
    url: `/api/pleroma/admin/users?query=${query}&page=${page}&filters=${filters}`,
    method: 'get',
    headers: authHeaders(token)
  })
}

export async function addRight(nickname, right, authHost, token) {
  return await request({
    baseURL: baseName(authHost),
    url: `/api/pleroma/admin/users/${nickname}/permission_group/${right}`,
    method: 'post',
    headers: authHeaders(token)
  })
}

export async function deleteRight(nickname, right, authHost, token) {
  return await request({
    baseURL: baseName(authHost),
    url: `/api/pleroma/admin/users/${nickname}/permission_group/${right}`,
    method: 'delete',
    headers: authHeaders(token)
  })
}

export async function deleteUser(nickname, authHost, token) {
  return await request({
    baseURL: baseName(authHost),
    url: `/api/pleroma/admin/users?nickname=${nickname}`,
    method: 'delete',
    headers: authHeaders(token)
  })
}

export async function tagUser(nicknames, tags, authHost, token) {
  return await request({
    baseURL: baseName(authHost),
    url: '/api/pleroma/admin/users/tag',
    method: 'put',
    headers: authHeaders(token),
    data: { nicknames, tags }
  })
}

export async function untagUser(nicknames, tags, authHost, token) {
  return await request({
    baseURL: baseName(authHost),
    url: '/api/pleroma/admin/users/tag',
    method: 'delete',
    headers: authHeaders(token),
    data: { nicknames, tags }
  })
}

const authHeaders = (token) => token ? { 'Authorization': `Bearer ${getToken()}` } : {}
