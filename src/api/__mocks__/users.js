export const users = [
  { active: true, deactivated: false, id: '2', nickname: 'allis', local: true, external: false, roles: { admin: true, moderator: false }, tags: [] },
  { active: true, deactivated: false, id: '10', nickname: 'bob', local: false, external: true, roles: { admin: false, moderator: false }, tags: ['sandbox'] },
  { active: false, deactivated: true, id: 'abc', nickname: 'john', local: true, external: false, roles: { admin: false, moderator: false }, tags: ['strip_media'] }
]

const filterUsers = (str) => {
  const filters = str.split(',').filter(item => item.length > 0)
  if (filters.length === 0) {
    return users
  }
  const applyFilters = (acc, filters, users) => {
    if (filters.length === 0) {
      return acc
    }
    const filteredUsers = users.filter(user => user[filters[0]])
    const newAcc = [...filteredUsers]
    return applyFilters(newAcc, filters.slice(1), filteredUsers)
  }
  return applyFilters([], filters, users)
}

export async function fetchUsers(filters, authHost, token, page = 1) {
  const filteredUsers = filterUsers(filters)
  return Promise.resolve({ data: {
    users: filteredUsers,
    count: filteredUsers.length,
    page_size: 50
  }})
}

export async function toggleUserActivation(nickname, authHost, token) {
  const response = users.find(user => user.nickname === nickname)
  return Promise.resolve({ data: { ...response, deactivated: !response.deactivated }})
}

export async function searchUsers(query, filters, authHost, token, page = 1) {
  const filteredUsers = filterUsers(filters)
  const response = filteredUsers.filter(user => user.nickname === query)
  return Promise.resolve({ data: {
    users: response,
    count: response.length,
    page_size: 50
  }})
}

export async function addRight(nickname, right, authHost, token) {
  return Promise.resolve({ data:
    { [`is_${right}`]: true }
  })
}

export async function deleteRight(nickname, right, authHost, token) {
  return Promise.resolve({ data:
    { [`is_${right}`]: false }
  })
}

export async function deleteUser(nickname, authHost, token) {
  return Promise.resolve({ data:
    nickname
  })
}

export async function tagUser(nickname, tag, authHost, token) {
  return Promise.resolve()
}

export async function untagUser(nickname, tag, authHost, token) {
  return Promise.resolve()
}
