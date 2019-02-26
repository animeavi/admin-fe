import request from '@/utils/request'

export async function fetchUsers() {
  return await request({
    url: '/api/pleroma/admin/users',
    method: 'get'
  })
}

export async function toggleUserActivation(nickname) {
  return await request({
    url: `/api/pleroma/admin/users/${nickname}/toggle_activation`,
    method: 'patch'
  })
}

export default { fetchUsers, toggleUserActivation }
