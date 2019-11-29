import { generateInviteToken, inviteViaEmail, listInviteTokens, revokeToken } from '@/api/invites'
import { Message } from 'element-ui'
import i18n from '@/lang'

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
      try {
        const { data } = await generateInviteToken(maxUse, expiresAt, getters.authHost, getters.token)
        commit('SET_NEW_TOKEN', { token: data.token, maxUse: data.max_use, expiresAt: data.expires_at })
      } catch (_e) {
        return
      }
      dispatch('FetchInviteTokens')
    },
    async InviteUserViaEmail({ commit, dispatch, getters }, { email, name }) {
      try {
        await inviteViaEmail(email, name, getters.authHost, getters.token)
      } catch (_e) {
        return
      }
      Message({
        message: i18n.t('invites.emailSent'),
        type: 'success',
        duration: 5 * 1000
      })
    },
    RemoveNewToken({ commit }) {
      commit('SET_NEW_TOKEN', {})
    },
    async RevokeToken({ commit, dispatch, getters }, token) {
      try {
        await revokeToken(token, getters.authHost, getters.token)
      } catch (_e) {
        return
      }
      dispatch('FetchInviteTokens')
    }
  }
}

export default invites
