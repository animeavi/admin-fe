import { changeStatusScope, deleteStatus, fetchStatusesByInstance } from '@/api/status'

const status = {
  state: {
    fetchedStatuses: [],
    loading: false,
    statusesByInstance: {
      selectedInstance: '',
      page: 1,
      pageSize: 30
    }
  },
  mutations: {
    CHANGE_PAGE: (state, page) => {
      state.statusesByInstance.page = page
    },
    CHANGE_SELECTED_INSTANCE: (state, instance) => {
      state.statusesByInstance.selectedInstance = instance
    },
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
    async ChangeStatusScope({ dispatch, getters }, { statusId, isSensitive, visibility, reportCurrentPage, userId, godmode, fetchStatusesByInstance }) {
      await changeStatusScope(statusId, isSensitive, visibility, getters.authHost, getters.token)
      if (reportCurrentPage !== 0) { // called from Reports
        dispatch('FetchReports', reportCurrentPage)
      } else if (userId.length > 0) { // called from User profile
        dispatch('FetchUserStatuses', { userId, godmode })
      } else if (fetchStatusesByInstance) { // called from Statuses by Instance
        dispatch('FetchStatusesByInstance')
      } else { // called from GroupedReports
        dispatch('FetchGroupedReports')
      }
    },
    async DeleteStatus({ dispatch, getters }, { statusId, reportCurrentPage, userId, godmode, fetchStatusesByInstance }) {
      await deleteStatus(statusId, getters.authHost, getters.token)
      if (reportCurrentPage !== 0) { // called from Reports
        dispatch('FetchReports', reportCurrentPage)
      } else if (userId.length > 0) { // called from User profile
        dispatch('FetchUserStatuses', { userId, godmode })
      } else if (fetchStatusesByInstance) { // called from Statuses by Instance
        dispatch('FetchStatusesByInstance')
      } else { // called from GroupedReports
        dispatch('FetchGroupedReports')
      }
    },
    async FetchStatusesByInstance({ commit, getters, state }) {
      commit('SET_LOADING', true)
      const statuses = await fetchStatusesByInstance(
        {
          instance: state.statusesByInstance.selectedInstance,
          authHost: getters.authHost,
          token: getters.token,
          pageSize: state.statusesByInstance.pageSize,
          page: state.statusesByInstance.page
        })

      commit('SET_STATUSES', statuses.data)
      commit('SET_LOADING', false)
    },
    async FetchStatusesPageByInstance({ commit, getters, state }) {
      commit('SET_LOADING', true)
      const statuses = await fetchStatusesByInstance(
        {
          instance: state.statusesByInstance.selectedInstance,
          authHost: getters.authHost,
          token: getters.token,
          pageSize: state.statusesByInstance.pageSize,
          page: state.statusesByInstance.page
        })

      commit('PUSH_STATUSES', statuses.data)
      commit('SET_LOADING', false)
    },
    HandleFilterChange({ commit }, instance) {
      commit('CHANGE_SELECTED_INSTANCE', instance)
    },
    HandlePageChange({ commit }, page) {
      commit('CHANGE_PAGE', page)
    }
  }
}

export default status
