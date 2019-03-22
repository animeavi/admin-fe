const users = [
  { deactivated: false, id: '1', nickname: 'john', local: true },
  { deactivated: false, id: '2', nickname: 'bob', local: false },
  { deactivated: true, id: '3', nickname: 'allis', local: true }
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
