import { changeState, changeStatusScope, deleteStatus, fetchReports, filterReports } from '@/api/reports'

const reports = {
  state: {
    fetchedReports: [],
    groupReports: true,
    idOfLastReport: '',
    stateFilter: '',
    loading: true
  },
  mutations: {
    SET_LAST_REPORT_ID: (state, id) => {
      state.idOfLastReport = id
    },
    SET_LOADING: (state, status) => {
      state.loading = status
    },
    SET_REPORTS: (state, reports) => {
      state.fetchedReports = reports
    },
    SET_REPORTS_FILTER: (state, filter) => {
      state.stateFilter = filter
    },
    SET_REPORTS_GROUPING: (state) => {
      state.groupReports = !state.groupReports
    }
  },
  actions: {
    async ChangeReportState({ commit, getters, state }, { reportState, reportId }) {
      const { data } = await changeState(reportState, reportId, getters.authHost, getters.token)
      const updatedReports = state.fetchedReports.map(report => report.id === reportId ? data : report)
      commit('SET_REPORTS', updatedReports)
    },
    async ChangeStatusScope({ dispatch, getters }, { statusId, isSensitive, visibility }) {
      await changeStatusScope(statusId, isSensitive, visibility, getters.authHost, getters.token)
      dispatch('FetchReports')
    },
    ClearFetchedReports({ commit }) {
      commit('SET_REPORTS', [])
      commit('SET_LAST_REPORT_ID', '')
    },
    async DeleteStatus({ dispatch, getters }, { statusId }) {
      deleteStatus(statusId, getters.authHost, getters.token)
      dispatch('FetchReports')
    },
    async FetchReports({ commit, getters, state }) {
      commit('SET_LOADING', true)
      const { data } = state.stateFilter.length === 0
        ? await fetchReports(state.page_limit, state.idOfLastReport, getters.authHost, getters.token)
        : await filterReports(state.stateFilter, state.page_limit, state.idOfLastReport, getters.authHost, getters.token)

      commit('SET_REPORTS', data.reports)
      commit('SET_LOADING', false)
    },
    SetFilter({ commit }, filter) {
      commit('SET_REPORTS_FILTER', filter)
    },
    ToggleReportsGrouping({ commit }) {
      commit('SET_REPORTS_GROUPING')
    }
  }
}

export default reports
