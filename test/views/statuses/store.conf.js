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
    status,
    user
  },
  getters
}
