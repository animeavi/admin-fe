import request from '@/utils/request'
import { getToken } from '@/utils/auth'

export async function fetchUsers(showLocalUsersOnly, token, page = 1) {
  return await request({
    url: `/api/pleroma/admin/users?page=${page}&local_only=${showLocalUsersOnly}`,
    method: 'get',
    headers: token ? { 'Authorization': `Bearer ${getToken()}` } : {}
  })
}

export async function toggleUserActivation(nickname, token) {
  return await request({
    url: `/api/pleroma/admin/users/${nickname}/toggle_activation`,
    method: 'patch',
    headers: token ? { 'Authorization': `Bearer ${getToken()}` } : {}
  })
}

export async function searchUsers(query, showLocalUsersOnly, token, page = 1) {
  return await request({
    url: `/api/pleroma/admin/users?query=${query}&page=${page}&local_only=${showLocalUsersOnly}`,
    method: 'get',
    headers: token ? { 'Authorization': `Bearer ${getToken()}` } : {}
  })
}

