import { changeStatusScope, deleteStatus, fetchStatusesByInstance } from '@/api/status'

const status = {
  state: {
    fetchedStatuses: [],
    loading: false
  },
  mutations: {
    SET_STATUSES: (state, statuses) => {
      state.fetchedStatuses = statuses
    },
    PUSH_STATUSES: (state, statuses) => {
      state.fetchedStatuses = [...state.fetchedStatuses, ...statuses]
    },
    SET_LOADING: (state, status) => {
      state.loading = status
    }
  },
  actions: {
    async ChangeStatusScope({ dispatch, getters }, { statusId, isSensitive, visibility, reportCurrentPage, userId, godmode }) {
      await changeStatusScope(statusId, isSensitive, visibility, getters.authHost, getters.token)
      if (reportCurrentPage !== 0) {
        dispatch('FetchReports', reportCurrentPage)
      } else if (userId.length > 0) {
        dispatch('FetchUserStatuses', { userId, godmode })
      }
    },
    async DeleteStatus({ dispatch, getters }, { statusId, reportCurrentPage, userId, godmode }) {
      await deleteStatus(statusId, getters.authHost, getters.token)
      if (reportCurrentPage !== 0) {
        dispatch('FetchReports', reportCurrentPage)
      } else if (userId.length > 0) {
        dispatch('FetchUserStatuses', { userId, godmode })
      }
    },
    async FetchStatusesByInstance({ commit, getters }, { instance, page, pageSize }) {
      commit('SET_LOADING', true)
      const statuses = await fetchStatusesByInstance(instance, getters.authHost, getters.token, pageSize, page)

      commit('SET_STATUSES', statuses.data)
      commit('SET_LOADING', false)
    },
    async FetchStatusesPageByInstance({ commit, getters }, { instance, page, pageSize }) {
      commit('SET_LOADING', true)
      const statuses = await fetchStatusesByInstance(instance, getters.authHost, getters.token, pageSize, page)

      commit('PUSH_STATUSES', statuses.data)
      commit('SET_LOADING', false)
    }
  }
}

export default status
