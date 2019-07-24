import Vue from 'vue'
import Vuex from 'vuex'
import app from './modules/app'
import errorLog from './modules/errorLog'
import permission from './modules/permission'
import reports from './modules/reports'
import tagsView from './modules/tagsView'
import user from './modules/user'
import userProfile from './modules/userProfile'
import users from './modules/users'
import getters from './getters'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    app,
    errorLog,
    permission,
    reports,
    tagsView,
    user,
    userProfile,
    users
  },
  getters
})

export default store
