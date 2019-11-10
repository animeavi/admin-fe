import { fetchDescription, fetchSettings, migrateToDB, updateSettings, uploadMedia } from '@/api/settings'
import { filterIgnored, parseTuples, valueHasTuples, wrapConfig } from './normalizers'

const settings = {
  state: {
    description: [],
    settings: {},
    ignoredIfNotEnabled: ['enabled', 'handler', 'password_authenticator', 'port', 'priv_dir'],
    loading: true
  },
  mutations: {
    REWRITE_CONFIG: (state, { tab, data }) => {
      state.settings[tab] = data
    },
    SET_DESCRIPTION: (state, data) => {
      state.description = data
    },
    SET_LOADING: (state, status) => {
      state.loading = status
    },
    SET_SETTINGS: (state, data) => {
      const newSettings = data.reduce((acc, { group, key, value }) => {
        if (group === 'cors_plug') {
          acc[':cors_plug'] = { ...acc[':cors_plug'], [key]: value }
        } else {
          const parsedValue = valueHasTuples(key, value) ? { value } : parseTuples(value, key)
          acc[key] = { ...acc[key], ...parsedValue }
        }
        return acc
      }, state.settings)
      state.settings = newSettings
    },
    UPDATE_SETTINGS: (state, { tab, data }) => {
      Object.keys(state.settings).map(configName => {
        if (configName === tab) {
          state.settings[configName] = { ...state.settings[configName], ...data }
        }
      })
    }
  },
  actions: {
    async FetchSettings({ commit, dispatch, getters }) {
      commit('SET_LOADING', true)
      const response = await fetchSettings(getters.authHost, getters.token)
      const description = await fetchDescription(getters.authHost, getters.token)
      if (response.data.configs.length === 0) {
        dispatch('MigrateToDB')
        dispatch('FetchSettings')
      }
      commit('SET_DESCRIPTION', description.data)
      commit('SET_SETTINGS', response.data.configs)
      commit('SET_LOADING', false)
    },
    async MigrateToDB({ getters }) {
      await migrateToDB(getters.authHost, getters.token)
    },
    RewriteConfig({ commit }, { tab, data }) {
      commit('REWRITE_CONFIG', { tab, data })
    },
    async SubmitChanges({ getters, commit, state }, data) {
      const filteredSettings = filterIgnored(state.settings, state.ignoredIfNotEnabled)
      const configs = data || wrapConfig(filteredSettings)
      const response = await updateSettings(configs, getters.authHost, getters.token)
      if (data) {
        commit('SET_SETTINGS', response.data.configs)
      }
    },
    UpdateSettings({ commit }, { tab, data }) {
      commit('UPDATE_SETTINGS', { tab, data })
    },
    async UploadMedia({ dispatch, getters, state }, { file, tab, inputName, childName }) {
      const response = await uploadMedia(file, getters.authHost, getters.token)
      const updatedValue = childName
        ? { ...state.settings[tab][inputName], ...{ [childName]: response.data.url }}
        : response.data.url
      dispatch('UpdateSettings', { tab, data: { [inputName]: updatedValue }})
    }
  }
}

export default settings
