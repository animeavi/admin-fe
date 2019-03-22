import getters  from '@/store/getters'
import app from '@/store/modules/app'
import user from '@/store/modules/user'
import users from '@/store/modules/users'

export default {
  modules: {
    app,
    users,
    user: {
      state: {
        user: '',
        id: '1',
        status: '',
        code: '',
        token: 'MmwSkMgBW6lAkWCFspIjX9icmLfqSCohSi-GReAZrQw',
        name: 'john',
        avatar: '',
        introduction: '',
        roles: ["admin"],
        setting: {
          articlePlatform: []
        }
      }, ...user
    }
  },
  getters
}
