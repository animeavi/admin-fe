const reports = [
  { created_at: '2019-05-21T21:35:33.000Z', account: { acct: 'benj', display_name: 'Benjamin Fame', tags: [] }, actor: { acct: 'admin' }, state: 'open', id: '2', content: 'This is a report', statuses: [] },
  { created_at: '2019-05-20T22:45:33.000Z', account: { acct: 'alice', display_name: 'Alice Pool', tags: [] }, actor: { acct: 'admin2' }, state: 'resolved', id: '1', content: 'Please block this user', statuses: [] },
  { created_at: '2019-05-18T13:01:33.000Z', account: { acct: 'nick', display_name: 'Nick Keys', tags: [] }, actor: { acct: 'admin' }, state: 'closed', id: '3', content: '', statuses: [] },
  { created_at: '2019-05-21T21:35:33.000Z', account: { acct: 'benj', display_name: 'Benjamin Fame', tags: [] }, actor: { acct: 'admin' }, state: 'open', id: '5', content: 'This is a report', statuses: [] },
  { created_at: '2019-05-20T22:45:33.000Z', account: { acct: 'alice', display_name: 'Alice Pool', tags: [] }, actor: { acct: 'admin2' }, state: 'resolved', id: '7', content: 'Please block this user', statuses: [
    { account: { display_name: 'Alice Pool', avatar: '' }, visibility: 'public', sensitive: false, id: '11', content: 'Hey!', url: '', created_at: '2019-05-10T21:35:33.000Z' },
    { account: { display_name: 'Alice Pool', avatar: '' }, visibility: 'unlisted', sensitive: true, id: '10', content: 'Bye!', url: '', created_at: '2019-05-10T21:00:33.000Z' }
  ] },
  { created_at: '2019-05-18T13:01:33.000Z', account: { acct: 'nick', display_name: 'Nick Keys', tags: [] }, actor: { acct: 'admin' }, state: 'closed', id: '6', content: '', statuses: [] },
  { created_at: '2019-05-18T13:01:33.000Z', account: { acct: 'nick', display_name: 'Nick Keys', tags: [] }, actor: { acct: 'admin' }, state: 'closed', id: '4', content: '', statuses: [] }
]

export async function fetchReports(limit, max_id, authHost, token) {
  const paginatedReports = max_id.length > 0 ? reports.slice(5) : reports.slice(0, 5)
  return Promise.resolve({ data: { reports: paginatedReports }})
}

export async function filterReports(filter, limit, max_id, authHost, token) {
  const filteredReports = reports.filter(report => report.state === filter)
  const paginatedReports = max_id.length > 0 ? filteredReports.slice(5) : filteredReports.slice(0, 5)
  return Promise.resolve({ data: { reports: paginatedReports }})
}

export async function changeState(state, id, authHost, token) {
  return Promise.resolve({ data: '' })
}

export async function changeStatusScope(id, sensitive, visibility, authHost, token) {
  const status = reports[4].statuses[0]
  return Promise.resolve({ data: { ...status, sensitive, visibility }})
}

export async function deleteStatus(statusId, authHost, token) {
  return Promise.resolve()
}
