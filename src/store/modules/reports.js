import { changeState, changeStatusScope, deleteStatus, fetchReports } from '@/api/reports'

const reports = {
  state: {
    fetchedReports: [],
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
    async ChangeReportState({ dispatch, getters, state }, { reportState, reportId }) {
      await changeState(reportState, reportId, getters.authHost, getters.token)
      dispatch('FetchReports', state.currentPage)
    },
    async ChangeStatusScope({ dispatch, getters, state }, { statusId, isSensitive, visibility }) {
      await changeStatusScope(statusId, isSensitive, visibility, getters.authHost, getters.token)
      dispatch('FetchReports', state.currentPage)
    },
    ClearFetchedReports({ commit }) {
      commit('SET_REPORTS', [])
      commit('SET_LAST_REPORT_ID', '')
    },
    async DeleteStatus({ dispatch, getters, state }, { statusId }) {
      await deleteStatus(statusId, getters.authHost, getters.token)
      dispatch('FetchReports', state.currentPage)
    },
    async FetchReports({ commit, getters, state }, page) {
      commit('SET_LOADING', true)
      const { data } = await fetchReports(state.stateFilter, page, state.pageSize, getters.authHost, getters.token)

      commit('SET_REPORTS', data.reports)
      commit('SET_REPORTS_COUNT', data.total)
      commit('SET_PAGE', page)
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
