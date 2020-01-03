import { fetchDescription, fetchSettings, removeSettings, updateSettings, uploadMedia } from '@/api/settings'
import { parseNonTuples, parseTuples, partialUpdate, valueHasTuples, wrapUpdatedSettings } from './normalizers'

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
    CLEAR_UPDATED_SETTINGS: (state) => {
      state.updatedSettings = {}
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
        acc[group][key] = { ...acc[group][key], ...parsedValue }
        return acc
      }, state.settings)
      state.settings = newSettings
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
    async RemoveSetting({ getters }, configs) {
      await removeSettings(configs, getters.authHost, getters.token)
    },
    async SubmitChanges({ getters, commit, state }) {
      const updatedData = Object.keys(state.updatedSettings).reduce((acc, group) => {
        acc[group] = Object.keys(state.updatedSettings[group]).reduce((acc, key) => {
          if (!partialUpdate(group, key)) {
            const updated = Object.keys(state.settings[group][key]).reduce((acc, settingName) => {
              const settingType = state.description
                .find(element => element.group === group && element.key === key).children
                .find(child => child.key === settingName).type
              acc[settingName] = [settingType, state.settings[group][key][settingName]]
              return acc
            }, {})
            acc[key] = updated
            return acc
          }
          acc[key] = state.updatedSettings[group][key]
          return acc
        }, {})
        return acc
      }, {})
      const configs = Object.keys(updatedData).reduce((acc, group) => {
        return [...acc, ...wrapUpdatedSettings(group, updatedData[group], state.settings)]
      }, [])
      const response = await updateSettings(configs, getters.authHost, getters.token)
      commit('SET_SETTINGS', response.data.configs)
      commit('CLEAR_UPDATED_SETTINGS')
    },
    UpdateSettings({ commit }, { group, key, input, value, type }) {
      key
        ? commit('UPDATE_SETTINGS', { group, key, input, value, type })
        : commit('UPDATE_SETTINGS', { group, key: input, input: '_value', value, type })
    },
    UpdateState({ commit, dispatch, state }, { group, key, input, value }) {
      if (key === 'Pleroma.Emails.Mailer' && input === ':adapter') {
        const subkeys = Object.keys(state.settings[group][key]).filter(el => el !== ':adapter')
        const emailsValue = subkeys.map(el => {
          return { 'tuple': [el, state.settings[group][key][el]] }
        })
        dispatch('RemoveSetting', [{ group, key, value: emailsValue, delete: true, subkeys }])
      }
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
