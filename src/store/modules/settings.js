import { fetchDescription, fetchSettings, removeSettings, updateSettings } from '@/api/settings'
import { checkPartialUpdate, parseNonTuples, parseTuples, valueHasTuples, wrapUpdatedSettings } from './normalizers'
import _ from 'lodash'

const settings = {
  state: {
    description: [],
    settings: {},
    updatedSettings: {},
    db: {},
    loading: true
  },
  mutations: {
    CLEAR_UPDATED_SETTINGS: (state) => {
      state.updatedSettings = {}
    },
    REMOVE_SETTING_FROM_UPDATED: (state, { group, key, subkeys }) => {
      if (_.get(state.updatedSettings, [group, key, subkeys[0]])) {
        const { [subkeys[0]]: value, ...updatedSettings } = state.updatedSettings[group][key]
        state.updatedSettings = updatedSettings
      }
    },
    SET_DESCRIPTION: (state, data) => {
      state.description = data
    },
    SET_LOADING: (state, status) => {
      state.loading = status
    },
    SET_SETTINGS: (state, data) => {
      const newSettings = data.reduce((acc, { group, key, value }) => {
        const parsedValue = valueHasTuples(key, value)
          ? { value: parseNonTuples(key, value) }
          : parseTuples(value, key)
        acc[group] = acc[group] ? { ...acc[group], [key]: parsedValue } : { [key]: parsedValue }
        return acc
      }, {})

      const newDbSettings = data.reduce((acc, { group, key, db }) => {
        if (db) {
          acc[group] = acc[group] ? { ...acc[group], [key]: db } : { [key]: db }
        }
        return acc
      }, {})

      state.settings = newSettings
      state.db = newDbSettings
    },
    UPDATE_SETTINGS: (state, { group, key, input, value, type }) => {
      const updatedSetting = !state.updatedSettings[group] || (key === 'Pleroma.Emails.Mailer' && input === ':adapter')
        ? { [key]: { [input]: [type, value] }}
        : { [key]: { ...state.updatedSettings[group][key], ...{ [input]: [type, value] }}}
      state.updatedSettings[group] = { ...state.updatedSettings[group], ...updatedSetting }
    },
    UPDATE_STATE: (state, { group, key, input, value }) => {
      const updatedState = key === 'Pleroma.Emails.Mailer' && input === ':adapter'
        ? { [key]: { [input]: value }}
        : { [key]: { ...state.settings[group][key], ...{ [input]: value }}}
      state.settings[group] = { ...state.settings[group], ...updatedState }
    }
  },
  actions: {
    async FetchSettings({ commit, getters }) {
      commit('SET_LOADING', true)
      const response = await fetchSettings(getters.authHost, getters.token)
      const description = await fetchDescription(getters.authHost, getters.token)

      commit('SET_DESCRIPTION', description.data)
      commit('SET_SETTINGS', response.data.configs)
      commit('SET_LOADING', false)
    },
    async RemoveSetting({ commit, getters }, configs) {
      await removeSettings(configs, getters.authHost, getters.token)
      const response = await fetchSettings(getters.authHost, getters.token)
      const { group, key, subkeys } = configs[0]
      commit('SET_SETTINGS', response.data.configs)
      commit('REMOVE_SETTING_FROM_UPDATED', { group, key, subkeys: subkeys || [] })
    },
    async SubmitChanges({ getters, commit, state }) {
      const updatedData = checkPartialUpdate(state.settings, state.updatedSettings, state.description)
      const configs = Object.keys(updatedData).reduce((acc, group) => {
        return [...acc, ...wrapUpdatedSettings(group, updatedData[group], state.settings)]
      }, [])

      await updateSettings(configs, getters.authHost, getters.token)
      const response = await fetchSettings(getters.authHost, getters.token)
      commit('SET_SETTINGS', response.data.configs)
      commit('CLEAR_UPDATED_SETTINGS')
    },
    UpdateSettings({ commit }, { group, key, input, value, type }) {
      key
        ? commit('UPDATE_SETTINGS', { group, key, input, value, type })
        : commit('UPDATE_SETTINGS', { group, key: input, input: '_value', value, type })
    },
    async UpdateState({ commit, getters, state }, { group, key, input, value }) {
      if (key === 'Pleroma.Emails.Mailer' && input === ':adapter') {
        const subkeys = Object.keys(state.settings[group][key]).filter(el => el !== ':adapter')
        await removeSettings([{ group, key, delete: true, subkeys }], getters.authHost, getters.token)
      }
      key
        ? commit('UPDATE_STATE', { group, key, input, value })
        : commit('UPDATE_STATE', { group, key: input, input: 'value', value })
    }
  }
}

export default settings
