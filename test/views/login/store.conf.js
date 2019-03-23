import app from '@/store/modules/app'
import errorLog from '@/store/modules/errorLog'
import user from '@/store/modules/user'
import users from '@/store/modules/users'
import getters from '@/store/getters'

export default {
  modules: {
    app,
    errorLog,
    user,
    users
  },
  getters
}

