let inviteTokens = [
  { expires_at: '01-01-2020', id: 1, invite_type: 'one_time', max_use: 3, token: 'DCN8XyTsVEuz9_KuxPlkbH1RgMsMHepwmZE2gyX07Jw=', used: false, uses: 1 },
  { expires_at: '02-02-2020', id: 2, invite_type: 'one_time', max_use: 1, token: 'KnJTHNedj2Mh14ckx06t-VfOuFL8oNA0nVAK1HLeLf4=', used: true, uses: 1 },
  { expires_at: '03-03-2020', id: 3, invite_type: 'one_time', max_use: 5, token: 'P6F5ayP-rAMbxtmtGJwFJcd7Yk_D2g6UZRfh8EskRUc=', used: false, uses: 0 }
]

export async function generateInviteToken(max_use, expires_at, authHost, token) {
  const newToken = {
    expires_at: '2019-04-10',
    id: 4,
    invite_type: 'one_time',
    max_use: 3,
    token: 'JYl0SjXW8t-t-pLSZBnZLf6PwjCW-qy6Dq70jfUOuqk=',
    used: false,
    uses: 0
  }
  inviteTokens = [...inviteTokens, newToken]
  return Promise.resolve({ data: newToken })
}

export async function inviteViaEmail(email, name, authHost, token) {
  return Promise.resolve()
}

export async function listInviteTokens(authHost, token) {
  return Promise.resolve({ data: {
    invites: inviteTokens
  }})
}

export async function revokeToken(tokenToRevoke, authHost, token) {
  inviteTokens.splice(3, 1, { ...inviteTokens[3], used: true })
  return Promise.resolve()
}

