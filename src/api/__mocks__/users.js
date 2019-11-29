export let users = [
  { active: true, deactivated: false, id: '2', nickname: 'allis', local: true, external: false, roles: { admin: true, moderator: false }, tags: [] },
  { active: true, deactivated: false, id: '10', nickname: 'bob', local: false, external: true, roles: { admin: false, moderator: false }, tags: ['sandbox'] },
  { active: false, deactivated: true, id: 'abc', nickname: 'john', local: true, external: false, roles: { admin: false, moderator: false }, tags: ['strip_media'] }
]

const userProfile = { avatar: 'avatar.jpg', display_name: 'Allis', nickname: 'allis', id: '2', tags: [], roles: { admin: true, moderator: false }, local: true, external: false }

const userStatuses = []

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

export async function fetchUser(id, authHost, token) {
  return Promise.resolve({ data: userProfile })
}

export async function fetchUsers(filters, authHost, token, page = 1) {
  const filteredUsers = filterUsers(filters)
  return Promise.resolve({ data: {
    users: filteredUsers,
    count: filteredUsers.length,
    page_size: 50
  }})
}

export async function fetchUserStatuses(id, authHost, godmode, token) {
  return Promise.resolve({ data: userStatuses })
}

export async function getPasswordResetToken(nickname, authHost, token) {
  return Promise.resolve({ data: { token: 'g05lxnBJQnL', link: 'http://url/api/pleroma/password_reset/g05lxnBJQnL' }})
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

export async function activateUsers(nicknames, authHost, token) {
  const response = nicknames.map(nickname => {
    const currentUser = users.find(user => user.nickname === nickname)
    return { ...currentUser, deactivated: false }
  })
  return Promise.resolve({ data: response })
}

export async function addRight(nicknames, right, authHost, token) {
  return Promise.resolve({ data:
    { [`is_${right}`]: true }
  })
}

export async function deactivateUsers(nicknames, authHost, token) {
  const response = nicknames.map(nickname => {
    const currentUser = users.find(user => user.nickname === nickname)
    return { ...currentUser, deactivated: true }
  })
  return Promise.resolve({ data: response })
}

export async function deleteRight(nickname, right, authHost, token) {
  return Promise.resolve({ data:
    { [`is_${right}`]: false }
  })
}

export async function deleteUsers(nicknames, authHost, token) {
  return Promise.resolve({ data:
    nicknames
  })
}

export async function tagUser(nickname, tag, authHost, token) {
  return Promise.resolve()
}

export async function untagUser(nickname, tag, authHost, token) {
  return Promise.resolve()
}

export async function createNewAccount(nickname, email, password, authHost, token) {
  const newUser = { active: true, deactivated: false, id: '15', nickname, local: true, external: false, roles: { admin: false, moderator: false }, tags: [] }
  users = [...users, newUser]
  return Promise.resolve()
}
