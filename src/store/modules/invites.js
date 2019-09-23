import { generateInviteToken, inviteViaEmail, listInviteTokens, revokeToken } from '@/api/invites'

const invites = {
  state: {
    inviteTokens: [],
    loading: false,
    newToken: {}
  },
  mutations: {
    SET_LOADING: (state, status) => {
      state.loading = status
    },
    SET_NEW_TOKEN: (state, token) => {
      state.newToken = token
    },
    SET_TOKENS: (state, tokens) => {
      state.inviteTokens = tokens
    }
  },
  actions: {
    async FetchInviteTokens({ commit, getters }) {
      commit('SET_LOADING', true)
      const response = await listInviteTokens(getters.authHost, getters.token)
      commit('SET_TOKENS', response.data.invites.reverse())
      commit('SET_LOADING', false)
    },
    async GenerateInviteToken({ commit, dispatch, getters }, { maxUse, expiresAt }) {
      const { data } = await generateInviteToken(maxUse, expiresAt, getters.authHost, getters.token)
      commit('SET_NEW_TOKEN', { token: data.token, maxUse: data.max_use, expiresAt: data.expires_at })
      dispatch('FetchInviteTokens')
    },
    async InviteUserViaEmail({ commit, dispatch, getters }, { email, name }) {
      await inviteViaEmail(email, name, getters.authHost, getters.token)
    },
    RemoveNewToken({ commit }) {
      commit('SET_NEW_TOKEN', {})
    },
    async RevokeToken({ commit, dispatch, getters }, token) {
      await revokeToken(token, getters.authHost, getters.token)
      dispatch('FetchInviteTokens')
    }
  }
}

export default invites
