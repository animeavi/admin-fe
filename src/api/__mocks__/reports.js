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

const groupedReports = [
  { account: { avatar: 'http://localhost:4000/images/avi.png', confirmation_pending: false, deactivated: false, display_name: 'leo', id: '9oG0YghgBi94EATI9I', local: true, nickname: 'leo', roles: { admin: false, moderator: false }, tags: [] },
    actors: [{ acct: 'admin', avatar: 'http://localhost:4000/images/avi.png', deactivated: false, display_name: 'admin', id: '9oFz4pTauG0cnJ581w', local: true, nickname: 'admin', roles: { admin: false, moderator: false }, tags: [], url: 'http://localhost:4000/users/admin', username: 'admin' }],
    date: '2019-11-23T12:56:11.969772Z',
    reports: [
      { created_at: '2019-05-21T21:35:33.000Z', account: { acct: 'benj', display_name: 'Benjamin Fame', tags: [] }, actor: { acct: 'admin' }, state: 'open', id: '2', content: 'This is a report', statuses: [] },
      { created_at: '2019-05-20T22:45:33.000Z', account: { acct: 'alice', display_name: 'Alice Pool', tags: [] }, actor: { acct: 'admin2' }, state: 'resolved', id: '7', content: 'Please block this user', statuses: [
        { account: { display_name: 'Alice Pool', avatar: '' }, visibility: 'public', sensitive: false, id: '11', content: 'Hey!', url: '', created_at: '2019-05-10T21:35:33.000Z' },
        { account: { display_name: 'Alice Pool', avatar: '' }, visibility: 'unlisted', sensitive: true, id: '10', content: 'Bye!', url: '', created_at: '2019-05-10T21:00:33.000Z' }
      ] }
    ],
    status: {
      account: { acct: 'leo' },
      content: 'At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis',
      created_at: '2019-11-23T12:55:20.000Z',
      id: '9pFoQO69piu7cUDnJg',
      url: 'http://localhost:4000/notice/9pFoQO69piu7cUDnJg',
      visibility: 'unlisted',
      sensitive: true
    },
    status_deleted: false
  }
]

export async function fetchReports(filter, page, pageSize, authHost, token) {
  return filter.length > 0
    ? Promise.resolve({ data: { reports: reports.filter(report => report.state === filter) }})
    : Promise.resolve({ data: { reports }})
}

export async function fetchGroupedReports(authHost, token) {
  return Promise.resolve({ data: { reports: groupedReports }})
}

export async function changeState(reportsData, authHost, token) {
  return Promise.resolve({ data: '' })
}

export async function changeStatusScope(id, sensitive, visibility, authHost, token) {
  const status = reports[4].statuses[0]
  return Promise.resolve({ data: { ...status, sensitive, visibility }})
}

export async function deleteStatus(statusId, authHost, token) {
  return Promise.resolve()
}
