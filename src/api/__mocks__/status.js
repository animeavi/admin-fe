export async function changeStatusScope(id, sensitive, visibility, authHost, token) {
  return Promise.resolve()
}

export async function deleteStatus(id, authHost, token) {
  return Promise.resolve()
}

export async function fetchStatusesCount(instance, authHost, token) {
  const data = {
    'status_visibility':
      { 'direct': 4, 'private': 10, 'public': 4, 'unlisted': 10 }
  }
  return Promise.resolve({ data })
}
