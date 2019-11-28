import { changeStatusScope, deleteStatus } from '@/api/status'

const status = {
  actions: {
    async ChangeStatusScope({ dispatch, getters }, { statusId, isSensitive, visibility, reportCurrentPage, userId, godmode }) {
      await changeStatusScope(statusId, isSensitive, visibility, getters.authHost, getters.token)
      if (reportCurrentPage !== 0) { // called from Reports
        dispatch('FetchReports', reportCurrentPage)
      } else if (userId.length > 0) { // called from User profile
        dispatch('FetchUserStatuses', { userId, godmode })
      } else { // called from GroupedReports
        dispatch('FetchGroupedReports')
      }
    },
    async DeleteStatus({ dispatch, getters }, { statusId, reportCurrentPage, userId, godmode }) {
      await deleteStatus(statusId, getters.authHost, getters.token)
      if (reportCurrentPage !== 0) {
        dispatch('FetchReports', reportCurrentPage)
      } else if (userId.length > 0) {
        dispatch('FetchUserStatuses', { userId, godmode })
      } else {
        dispatch('FetchGroupedReports')
      }
    }
  }
}

export default status
