import { loginByUsername, getUserInfo } from '@/api/login'
import { getNodeInfo } from '@/api/nodeInfo'
import { getToken, setToken, removeToken, getAuthHost, setAuthHost, removeAuthHost } from '@/utils/auth'

const user = {
  state: {
    user: '',
    id: '',
    status: '',
    code: '',
    token: getToken(),
    authHost: getAuthHost(),
    name: '',
    avatar: '',
    introduction: '',
    roles: [],
    setting: {
      articlePlatform: []
    },
    nodeInfo: {}
  },

  mutations: {
    SET_CODE: (state, code) => {
      state.code = code
    },
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_INTRODUCTION: (state, introduction) => {
      state.introduction = introduction
    },
    SET_SETTING: (state, setting) => {
      state.setting = setting
    },
    SET_STATUS: (state, status) => {
      state.status = status
    },
    SET_NAME: (state, name) => {
      state.name = name
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    },
    SET_ID: (state, id) => {
      state.id = id
    },
    SET_AUTH_HOST: (state, authHost) => {
      state.authHost = authHost
    },
    SET_NODE_INFO: (state, nodeInfo) => {
      state.nodeInfo = nodeInfo
    }
  },

  actions: {
    LoginByUsername({ commit, dispatch }, { username, authHost, password }) {
      return new Promise((resolve, reject) => {
        loginByUsername(username, password, authHost).then(response => {
          const data = response.data
          commit('SET_TOKEN', data.access_token)
          commit('SET_AUTH_HOST', authHost)
          setToken(data.access_token)
          setAuthHost(authHost)
          resolve()
        }).catch(error => {
          dispatch('addErrorLog', { message: error.message })
          reject(error)
        })
      })
    },
    async GetNodeInfo({ commit, state }) {
      const nodeInfo = await getNodeInfo(state.authHost)

      commit('SET_NODE_INFO', nodeInfo.data)
    },
    GetUserInfo({ commit, state }) {
      return new Promise((resolve, reject) => {
        getUserInfo(state.token, state.authHost).then(response => {
          const data = response.data

          if (!data) {
            reject('Verification failed, please login again.')
          }

          if (data.pleroma && data.pleroma.is_admin) {
            commit('SET_ROLES', ['admin'])
          } else {
            reject('getInfo: roles must be a non-null array!')
          }

          commit('SET_NAME', data.username)
          commit('SET_ID', data.id)
          commit('SET_AVATAR', data.avatar)
          commit('SET_INTRODUCTION', '')
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },
    LogOut({ commit }) {
      commit('SET_TOKEN', '')
      commit('SET_ROLES', [])
      removeToken()
      removeAuthHost()
    },
    FedLogOut({ commit }) {
      return new Promise(resolve => {
        commit('SET_TOKEN', '')
        removeToken()
        removeAuthHost()
        resolve()
      })
    },
    async LoginByPleromaFE({ commit, dispatch }, { token }) {
      commit('SET_TOKEN', token)
      setToken(token)
      commit('SET_AUTH_HOST', window.location.host)
      setAuthHost(window.location.host)

      dispatch('GetUserInfo')
    }
  }
}

export default user
