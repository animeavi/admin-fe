import request from '@/utils/request'

export async function fetchUsers(page = 1, page_size) {
  return await request({
    url: `/api/pleroma/admin/users?page=${page}&page_size=${page_size}`,
    method: 'get'
  })
}

export async function toggleUserActivation(nickname) {
  return await request({
    url: `/api/pleroma/admin/users/${nickname}/toggle_activation`,
    method: 'patch'
  })
}

export async function searchUsers(query, page = 1, page_size) {
  return await request({
    url: `/api/pleroma/admin/users/search?query=${query}&page=${page}&page_size=${page_size}`,
    method: 'get'
  })
}

export default { fetchUsers, toggleUserActivation }
