import { changeStatusScope, deleteStatus, fetchStatuses, fetchStatusesByInstance } from '@/api/status'

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
    SET_STATUSES_BY_INSTANCE: (state, statuses) => {
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
      }
    },
    async FetchStatuses({ commit, getters }, { godmode, localOnly }) {
      commit('SET_LOADING', true)
      await fetchStatuses({ godmode, localOnly, authHost: getters.authHost, token: getters.token })
      commit('SET_LOADING', false)
    },
    async FetchStatusesByInstance({ commit, getters, state }) {
      commit('SET_LOADING', true)
      const statuses = state.statusesByInstance.selectedInstance === ''
        ? { data: [] }
        : await fetchStatusesByInstance(
          {
            instance: state.statusesByInstance.selectedInstance,
            authHost: getters.authHost,
            token: getters.token,
            pageSize: state.statusesByInstance.pageSize,
            page: state.statusesByInstance.page
          })

      commit('SET_STATUSES_BY_INSTANCE', statuses.data)
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
