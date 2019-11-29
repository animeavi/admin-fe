import { changeState, fetchReports, fetchGroupedReports } from '@/api/reports'

const reports = {
  state: {
    fetchedReports: [],
    fetchedGroupedReports: [],
    totalReportsCount: 0,
    currentPage: 1,
    pageSize: 50,
    groupReports: false,
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
    SET_PAGE: (state, page) => {
      state.currentPage = page
    },
    SET_REPORTS: (state, reports) => {
      state.fetchedReports = reports
    },
    SET_GROUPED_REPORTS: (state, reports) => {
      state.fetchedGroupedReports = reports
    },
    SET_REPORTS_COUNT: (state, total) => {
      state.totalReportsCount = total
    },
    SET_REPORTS_FILTER: (state, filter) => {
      state.stateFilter = filter
    },
    SET_REPORTS_GROUPING: (state) => {
      state.groupReports = !state.groupReports
    }
  },
  actions: {
    async ChangeReportState({ commit, getters, state }, reportsData) {
      changeState(reportsData, getters.authHost, getters.token)

      const updatedReports = state.fetchedReports.map(report => {
        const updatedReportsIds = reportsData.map(({ id }) => id)
        return updatedReportsIds.includes(report.id) ? { ...report, state: reportsData[0].state } : report
      })

      const updatedGroupedReports = state.fetchedGroupedReports.map(group => {
        const updatedReportsIds = reportsData.map(({ id }) => id)
        const updatedReports = group.reports.map(report => updatedReportsIds.includes(report.id) ? { ...report, state: reportsData[0].state } : report)
        return { ...group, reports: updatedReports }
      })

      commit('SET_REPORTS', updatedReports)
      commit('SET_GROUPED_REPORTS', updatedGroupedReports)
    },
    ClearFetchedReports({ commit }) {
      commit('SET_REPORTS', [])
    },
    async FetchReports({ commit, getters, state }, page) {
      commit('SET_LOADING', true)
      const { data } = await fetchReports(state.stateFilter, page, state.pageSize, getters.authHost, getters.token)

      commit('SET_REPORTS', data.reports)
      commit('SET_REPORTS_COUNT', data.total)
      commit('SET_PAGE', page)
      commit('SET_LOADING', false)
    },
    async FetchGroupedReports({ commit, getters }) {
      commit('SET_LOADING', true)
      const { data } = await fetchGroupedReports(getters.authHost, getters.token)

      commit('SET_GROUPED_REPORTS', data.reports)
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
