import Vue from 'vue'
import Vuex from 'vuex'
import app from './modules/app'
import errorLog from './modules/errorLog'
import moderationLog from './modules/moderationLog'
import invites from './modules/invites'
import instance from './modules/instance'
import permission from './modules/permission'
import relays from './modules/relays'
import reports from './modules/reports'
import settings from './modules/settings'
import status from './modules/status'
import tagsView from './modules/tagsView'
import user from './modules/user'
import userProfile from './modules/userProfile'
import users from './modules/users'
import getters from './getters'
import emojiPacks from './modules/emojiPacks.js'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    app,
    errorLog,
    moderationLog,
    invites,
    instance,
    permission,
    relays,
    reports,
    settings,
    status,
    tagsView,
    user,
    userProfile,
    users,
    emojiPacks
  },
  getters
})

export default store
