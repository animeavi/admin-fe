import request from '@/utils/request'

export async function fetchUsers(page = 1, showLocalUsers) {
  return await request({
    url: `/api/pleroma/admin/users?page=${page}&local_only=${showLocalUsers}`,
    method: 'get'
  })
}

export async function toggleUserActivation(nickname) {
  return await request({
    url: `/api/pleroma/admin/users/${nickname}/toggle_activation`,
    method: 'patch'
  })
}

export async function searchUsers(query, page = 1, showLocalUsers) {
  return await request({
    url: `/api/pleroma/admin/users?query=${query}&page=${page}&local_only=${showLocalUsers}`,
    method: 'get'
  })
}

