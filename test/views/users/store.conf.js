import app from '@/store/modules/app'
import settings from '@/store/modules/settings'
import user from '@/store/modules/user'
import userProfile from '@/store/modules/userProfile'
import users from '@/store/modules/users'
import getters from '@/store/getters'

export default {
  modules: {
    app,
    settings,
    user,
    userProfile,
    users
  },
  getters
}
