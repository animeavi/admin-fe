import app from '@/store/modules/app'
import user from '@/store/modules/user'
import users from '@/store/modules/users'
import relays from '@/store/modules/relays'
import settings from '@/store/modules/settings'
import getters from '@/store/getters'

export default {
  modules: {
    app,
    relays,
    settings,
    user,
    users
  },
  getters
}
