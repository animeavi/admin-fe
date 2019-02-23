import request from '@/utils/request'

export async function fetchUsers() {
  return await request({
    url: '/api/pleroma/admin/users',
    method: 'get'
  })
}

export default { fetchUsers }
