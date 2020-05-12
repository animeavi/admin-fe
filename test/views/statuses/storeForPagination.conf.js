import app from '@/store/modules/app'
import peers from '@/store/modules/peers'
import user from '@/store/modules/user'
import settings from '@/store/modules/settings'
import status from '@/store/modules/status'
import getters from '@/store/getters'

export default {
  modules: {
    app,
    peers,
    settings,
    status: { ...status, state: { ...status.state, statusesByInstance: { ...status.state.statusesByInstance, pageSize: 1 }}},
    user: { ...user, state: { ...user.state, authHost: 'localhost:4000' }}
  },
  getters
}
