import { fetchDescription, fetchSettings, migrateToDB, updateSettings, uploadMedia } from '@/api/settings'
import { parseTuples, valueHasTuples } from './normalizers'

const settings = {
  state: {
    description: [],
    settings: {
      ':auto_linker': {},
      ':cors_plug': {},
      ':esshd': {},
      ':http_signatures': {},
      ':logger': {},
      ':mime': {},
      ':phoenix': {},
      ':pleroma': {},
      ':prometheus': {},
      ':quack': {},
      ':tesla': {},
      ':ueberauth': {},
      ':web_push_encryption': {}
    },
    updatedSettings: {},
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
        const parsedValue = valueHasTuples(key, value) ? { value } : parseTuples(value, key)
        acc[group][key] = { ...acc[group][key], ...parsedValue }
        return acc
      }, state.settings)
      state.settings = newSettings
    },
    UPDATE_SETTINGS: (state, { group, key, input, value, type }) => {
      const updatedSetting = state.updatedSettings[group]
        ? { [key]: { ...state.updatedSettings[group][key], ...{ [input]: [type, value] }}}
        : { [key]: { [input]: [type, value] }}
      state.updatedSettings[group] = { ...state.updatedSettings[group], ...updatedSetting }
    },
    UPDATE_STATE: (state, { group, key, input, value }) => {
      const updatedState = { [key]: { ...state.settings[group][key], ...{ [input]: value }}}
      state.settings[group] = { ...state.settings[group], ...updatedState }
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
    async SubmitChanges({ getters, commit, state }) {
      const configs = state.updatedSettings
      const response = await updateSettings(configs, getters.authHost, getters.token)
      commit('SET_SETTINGS', response.data.configs)
    },
    UpdateSettings({ commit }, { group, key, input, value, type }) {
      key
        ? commit('UPDATE_SETTINGS', { group, key, input, value, type })
        : commit('UPDATE_SETTINGS', { group, key: input, input: 'value', value, type })
    },
    UpdateState({ commit }, { group, key, input, value }) {
      key
        ? commit('UPDATE_STATE', { group, key, input, value })
        : commit('UPDATE_STATE', { group, key: input, input: 'value', value })
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
