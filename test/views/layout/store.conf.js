import app from '@/store/modules/app'
import errorLog from '@/store/modules/errorLog'
import permission from '@/store/modules/permission'
import tagsView from '@/store/modules/tagsView'
import user from '@/store/modules/user'
import getters from '@/store/getters'

export default {
  modules: {
    app,
    errorLog,
    permission,
    tagsView,
    user: {
      ...user,
      state: {
        id:"10",
        status: '',
        code: '',
        token: "foo123",
        authHost:"apple",
        name:"bob",
        avatar: '',
        introduction: '',
        roles: ['admin'],
        setting: {
          articlePlatform: []
        }
      }
    }
  },
  getters
}
