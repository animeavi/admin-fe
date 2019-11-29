import { fetchLog, fetchAdmins, fetchModerators } from '@/api/moderationLog'

const moderationLog = {
  state: {
    fetchedLog: [],
    logItemsCount: 0,
    admins: [],
    moderators: [],
    logLoading: true,
    adminsLoading: true
  },
  mutations: {
    SET_LOG_LOADING: (state, status) => {
      state.logLoading = status
    },
    SET_ADMINS_LOADING: (state, status) => {
      state.adminsLoading = status
    },
    SET_MODERATION_LOG: (state, log) => {
      state.fetchedLog = log
    },
    SET_MODERATION_LOG_COUNT: (state, count) => {
      state.logItemsCount = count
    },
    SET_ADMINS: (state, admins) => {
      state.admins = admins
    },
    SET_MODERATORS: (state, moderators) => {
      state.moderators = moderators
    }
  },
  actions: {
    async FetchModerationLog({ commit, getters }, opts = {}) {
      const response = await fetchLog(getters.authHost, getters.token, opts)

      commit('SET_MODERATION_LOG', response.data.items)
      commit('SET_MODERATION_LOG_COUNT', response.data.total)
      commit('SET_LOG_LOADING', false)
    },
    async FetchAdmins({ commit, getters }) {
      const adminsResponse = await fetchAdmins(getters.authHost, getters.token)
      const moderatorsResponse = await fetchModerators(getters.authHost, getters.token)

      commit('SET_ADMINS', adminsResponse.data)
      commit('SET_MODERATORS', moderatorsResponse.data)
      commit('SET_ADMINS_LOADING', false)
    }
  }
}

export default moderationLog
