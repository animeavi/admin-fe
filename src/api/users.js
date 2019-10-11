import request from '@/utils/request'
import { getToken } from '@/utils/auth'
import { baseName } from './utils'

export async function activateUsers(nicknames, authHost, token) {
  return await request({
    baseURL: baseName(authHost),
    url: `/api/pleroma/admin/users/activate`,
    method: 'patch',
    headers: authHeaders(token),
    data: { nicknames }
  })
}

export async function addRight(nicknames, right, authHost, token) {
  return await request({
    baseURL: baseName(authHost),
    url: `/api/pleroma/admin/users/permission_group/${right}`,
    method: 'post',
    headers: authHeaders(token),
    data: { nicknames }
  })
}

export async function createNewAccount(nickname, email, password, authHost, token) {
  return await request({
    baseURL: baseName(authHost),
    url: '/api/pleroma/admin/users',
    method: 'post',
    headers: authHeaders(token),
    data: { users: [{ nickname, email, password }] }
  })
}

export async function deactivateUsers(nicknames, authHost, token) {
  return await request({
    baseURL: baseName(authHost),
    url: `/api/pleroma/admin/users/deactivate`,
    method: 'patch',
    headers: authHeaders(token),
    data: { nicknames }
  })
}

export async function deleteRight(nicknames, right, authHost, token) {
  return await request({
    baseURL: baseName(authHost),
    url: `/api/pleroma/admin/users/permission_group/${right}`,
    method: 'delete',
    headers: authHeaders(token),
    data: { nicknames }
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

export async function fetchUser(id, authHost, token) {
  return await request({
    baseURL: baseName(authHost),
    url: `/api/pleroma/admin/users/${id}`,
    method: 'get',
    headers: authHeaders(token)
  })
}

export async function fetchUsers(filters, authHost, token, page = 1) {
  return await request({
    baseURL: baseName(authHost),
    url: `/api/pleroma/admin/users?page=${page}&filters=${filters}`,
    method: 'get',
    headers: authHeaders(token)
  })
}

export async function getPasswordResetToken(nickname, authHost, token) {
  return await request({
    baseURL: baseName(authHost),
    url: `/api/pleroma/admin/users/${nickname}/password_reset`,
    method: 'get',
    headers: authHeaders(token)
  })
}

export async function requirePasswordReset(nickname, authHost, token) {
  return await request({
    baseURL: baseName(authHost),
    url: `/api/pleroma/admin/users/${nickname}/force_password_reset`,
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

export async function fetchUserStatuses(id, authHost, godmode, token) {
  return await request({
    baseURL: baseName(authHost),
    url: `/api/pleroma/admin/users/${id}/statuses?godmode=${godmode}`,
    method: 'get',
    headers: authHeaders(token)
  })
}

const authHeaders = (token) => token ? { 'Authorization': `Bearer ${getToken()}` } : {}
