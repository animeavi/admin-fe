import { fetchDescription, fetchSettings, migrateToDB, updateSettings, uploadMedia } from '@/api/settings'
import { parseTuples, parseValue, valueHasTuples } from './normalizers'

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
      const updatedState = { [key]: { ...state.settings[group][key], ...{ [input]: value }}}
      state.settings[group] = { ...state.settings[group], ...updatedState }

      const settingKey = `${group}/${key}/${input}`
      state.updatedSettings = {
        ...state.updatedSettings,
        ...{ [settingKey]: { group, key, value: parseValue(input, value, type) }}
      }
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
      const configs = Object.values(state.updatedSettings)
      const response = await updateSettings(configs, getters.authHost, getters.token)
      commit('SET_SETTINGS', response.data.configs)
    },
    UpdateSettings({ commit }, { group, key, input, value, type }) {
      commit('UPDATE_SETTINGS', { group, key, input, value, type })
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
