const users = [
  { deactivated: false, id: '2', nickname: 'allis', local: true, roles: { admin: true, moderator: false }, tags: [] },
  { deactivated: false, id: '10', nickname: 'bob', local: false, roles: { admin: false, moderator: true }, tags: ['sandbox'] },
  { deactivated: true, id: 'abc', nickname: 'john', local: true, roles: { admin: false, moderator: false }, tags: ['strip_media'] }
]

export async function fetchUsers(showLocalUsersOnly, token, page = 1) {
  const filteredUsers = showLocalUsersOnly ? users.filter(user => user.local) : users
  return Promise.resolve({ data: {
    users: filteredUsers,
    count: filteredUsers.length,
    page_size: 50
  }})
}

export async function toggleUserActivation(nickname, token) {
  const response = users.find(user => user.nickname === nickname)
  return Promise.resolve({ data: { ...response, deactivated: !response.deactivated }})
}

export async function searchUsers(query, showLocalUsersOnly, token, page = 1) {
  const filteredUsers = showLocalUsersOnly ? users.filter(user => user.local) : users
  const response = filteredUsers.filter(user => user.nickname === query)
  return Promise.resolve({ data: {
    users: response,
    count: response.length,
    page_size: 50
  }})
}

export async function addRight(nickname, right, token) {
  return Promise.resolve({ data:
    { [`is_${right}`]: true }
  })
}

export async function deleteRight(nickname, right, token) {
  return Promise.resolve({ data:
    { [`is_${right}`]: false }
  })
}

export async function deleteUser(nickname, token) {
  return Promise.resolve({ data:
    nickname
  })
}

export async function tagUser(nickname, tag, token) {
  return Promise.resolve()
}

export async function untagUser(nickname, tag, token) {
  return Promise.resolve()
}
