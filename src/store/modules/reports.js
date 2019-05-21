import { fetchReports, toggleReportsFilter } from '@/api/reports'

const reports = {
  state: {
    fetchedReports: [],
    idOfLastReport: '',
    page_limit: 5,
    loading: true
  },
  mutations: {
    SET_REPORTS: (state, reports) => {
      state.fetchedReports = state.fetchedReports.concat(reports)
    },
    SET_REPORT: (state, { index, report }) => {
      state.fetchedReports[index] = report
    },
    SET_LOADING: (state, status) => {
      state.loading = status
    },
    SET_LAST_REPORT_ID: (state, id) => {
      state.idOfLastReport = id
    }
  },
  actions: {
    async FetchReports({ commit, state, getters }) {
      commit('SET_LOADING', true)
      const response = await fetchReports(state.page_limit, state.idOfLastReport, getters.authHost, getters.token)
      const reports = response.data.reports
      const id = reports.length > 0 ? reports[reports.length - 1].id : state.idOfLastReport

      commit('SET_REPORTS', reports)
      commit('SET_LAST_REPORT_ID', id)
      commit('SET_LOADING', false)
    },
    async ToggleReportsFilter({ getters }, filters) {
      const response = await toggleReportsFilter(getters.authHost, getters.token, filters)
      return response.data
    }
    // async AddNote({ commit, state, getters }, { reportId, note }) {
    //   const report = state.fetchedReports.find(report => report.id === reportId)
    //   report.notes = [...report.notes, note]
    //   const reportIndex = state.fetchedReports.findIndex(report => report.id === reportId)
    //   commit('SET_REPORT', { reportIndex, report })
    // },
    // async DeleteNote({ commit, state }, { reportId, noteId }) {
    //   const response = deleteNote(reportId, noteId)
    //   const report = state.fetchedReports.find(report => report.id === reportId)
    //   report.notes = response
    //   const reportIndex = state.fetchedReports.findIndex(report => report.id === reportId)
    //   commit('SET_REPORT', { reportIndex, report })
    // }
  }
}

export default reports
