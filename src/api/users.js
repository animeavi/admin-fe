import request from '@/utils/request'

export async function fetchUsers(page = 1) {
  return await request({
    url: `/api/pleroma/admin/users?page=${page}`,
    method: 'get'
  })
}

export async function toggleUserActivation(nickname) {
  return await request({
    url: `/api/pleroma/admin/users/${nickname}/toggle_activation`,
    method: 'patch'
  })
}

export async function searchUsers(query) {
  return await request({
    url: `/api/pleroma/admin/users/search?query=${query}`,
    method: 'get'
  })
}

export default { fetchUsers, toggleUserActivation }
