import { changeStatusScope, deleteStatus } from '@/api/status'

const status = {
  actions: {
    async ChangeStatusScope({ dispatch, getters, state }, { statusId, isSensitive, visibility }) {
      await changeStatusScope(statusId, isSensitive, visibility, getters.authHost, getters.token)
      dispatch('FetchReports', state.currentPage)
    },
    async DeleteStatus({ dispatch, getters, state }, { statusId }) {
      await deleteStatus(statusId, getters.authHost, getters.token)
      dispatch('FetchReports', state.currentPage)
    }
  }
}

export default status
