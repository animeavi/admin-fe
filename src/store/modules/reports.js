import { changeState, changeStatusScope, fetchReports, filterReports } from '@/api/reports'

const reports = {
  state: {
    fetchedReports: [],
    idOfLastReport: '',
    page_limit: 5,
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
    }
  },
  actions: {
    async ChangeReportState({ commit, getters, state }, { reportState, reportId }) {
      const { data } = await changeState(reportState, reportId, getters.authHost, getters.token)
      const updatedReports = state.fetchedReports.map(report => report.id === reportId ? data : report)
      commit('SET_REPORTS', updatedReports)
    },
    async ChangeStatusScope({ commit, getters, state }, { statusId, isSensitive, visibility, reportId }) {
      const { data } = await changeStatusScope(statusId, isSensitive, visibility, getters.authHost, getters.token)
      const updatedReports = state.fetchedReports.map(report => {
        if (report.id === reportId) {
          const statuses = report.statuses.map(status => status.id === statusId ? data : status)
          return { ...report, statuses }
        } else {
          return report
        }
      })
      commit('SET_REPORTS', updatedReports)
    },
    async FetchReports({ commit, getters, state }) {
      commit('SET_LOADING', true)
      const response = await fetchReports(state.page_limit, state.idOfLastReport, getters.authHost, getters.token)
      const reports = state.fetchedReports.concat(response.data.reports)
      const id = reports.length > 0 ? reports[reports.length - 1].id : state.idOfLastReport

      commit('SET_REPORTS', reports)
      commit('SET_LAST_REPORT_ID', id)
      commit('SET_LOADING', false)
    },
    async ToggleReportsFilter({ commit, dispatch, getters, state }, filter) {
      commit('SET_REPORTS', [])
      commit('SET_LAST_REPORT_ID', '')

      if (filter.length === 0) {
        dispatch('FetchReports')
      } else {
        commit('SET_REPORTS_FILTER', filter)
        commit('SET_LOADING', true)

        const response = await filterReports(state.stateFilter, state.page_limit, state.idOfLastReport, getters.authHost, getters.token)
        const reports = state.fetchedReports.concat(response.data.reports)
        const id = reports.length > 0 ? reports[reports.length - 1].id : state.idOfLastReport

        commit('SET_REPORTS', reports)
        commit('SET_LAST_REPORT_ID', id)
        commit('SET_LOADING', false)
      }
    }
  }
}

export default reports
