import Vue from 'vue'
import Vuex from 'vuex'
import app from './modules/app'
import errorLog from './modules/errorLog'
import invites from './modules/invites'
import permission from './modules/permission'
import reports from './modules/reports'
import settings from './modules/settings'
import tagsView from './modules/tagsView'
import user from './modules/user'
import userProfile from './modules/userProfile'
import users from './modules/users'
import getters from './getters'
import emoji_packs from './modules/emoji_packs.js'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    app,
    errorLog,
    invites,
    permission,
    reports,
    settings,
    tagsView,
    user,
    userProfile,
    users,
    emoji_packs
  },
  getters
})

export default store
