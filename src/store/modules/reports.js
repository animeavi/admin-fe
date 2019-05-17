import { fetchReports } from '@/api/reports'

const reports = {
  state: {
    fetchedReports: [],
    indexOfLastShownReport: 0,
    size: 3,
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
    SET_INDEX: (state) => {
      state.indexOfLastShownReport = state.indexOfLastShownReport + state.size
    }
  },
  actions: {
    async FetchReports({ commit, getters }) {
      commit('SET_LOADING', true)
      const response = await fetchReports(getters.authHost, getters.token)

      commit('SET_REPORTS', response.data.reports)
      commit('SET_INDEX')
      commit('SET_LOADING', false)
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
