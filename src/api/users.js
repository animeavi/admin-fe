import request from '@/utils/request'
import { getToken } from '@/utils/auth'

export async function fetchUsers(showLocalUsersOnly, token, page = 1) {
  return await request({
    url: `/api/pleroma/admin/users?page=${page}&local_only=${showLocalUsersOnly}`,
    method: 'get',
    headers: authHeaders(token)
  })
}

export async function toggleUserActivation(nickname, token) {
  return await request({
    url: `/api/pleroma/admin/users/${nickname}/toggle_activation`,
    method: 'patch',
    headers: authHeaders(token)
  })
}

export async function searchUsers(query, showLocalUsersOnly, token, page = 1) {
  return await request({
    url: `/api/pleroma/admin/users?query=${query}&page=${page}&local_only=${showLocalUsersOnly}`,
    method: 'get',
    headers: authHeaders(token)
  })
}

export async function addRight(nickname, right, token) {
  return await request({
    url: `/api/pleroma/admin/permission_group/${nickname}/${right}`,
    method: 'post',
    headers: authHeaders(token)
  })
}

export async function deleteRight(nickname, right, token) {
  return await request({
    url: `/api/pleroma/admin/permission_group/${nickname}/${right}`,
    method: 'delete',
    headers: authHeaders(token)
  })
}

export async function deleteUser(nickname, token) {
  return await request({
    url: `/api/pleroma/admin/user.json?nickname=${nickname}`,
    method: 'delete',
    headers: authHeaders(token)
  })
}

export async function tagUser(nickname, tag, token) {
  return await request({
    url: '/api/pleroma/admin/users/tag',
    method: 'put',
    headers: authHeaders(token),
    data: { nicknames: [nickname], tags: [tag] }
  })
}

export async function untagUser(nickname, tag, token) {
  return await request({
    url: '/api/pleroma/admin/users/tag',
    method: 'delete',
    headers: authHeaders(token),
    data: { nicknames: [nickname], tags: [tag] }
  })
}

const authHeaders = (token) => token ? { 'Authorization': `Bearer ${getToken()}` } : {}
