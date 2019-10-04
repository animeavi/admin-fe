import { changeStatusScope, deleteStatus } from '@/api/status'

const status = {
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
    }
  }
}

export default status
