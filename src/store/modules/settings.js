import { fetchSettings, updateSettings, uploadMedia } from '@/api/settings'
import { initialSettings } from '@/api/initialDataForConfig'
import { filterIgnored, parseTuples, valueHasTuples, wrapConfig } from './normalizers'

const settings = {
  state: {
    settings: {
      'activitypub': {},
      'adapter': {},
      'admin_token': {},
      'assets': { mascots: {}},
      'auth': {},
      'auto_linker': { opts: {}},
      'backends': {},
      'chat': {},
      'console': { colors: {}},
      'credentials': {},
      'database': {},
      'ecto_repos': {},
      'emoji': { groups: {}},
      'enabled': {},
      'ex_syslogger': {},
      'expose': {},
      'fetch_initial_posts': {},
      'format_encoders': {},
      'frontend_configurations': { pleroma_fe: {}, masto_fe: {}},
      'gopher': {},
      'hackney_pools': { federation: {}, media: {}, upload: {}},
      'handler': {},
      'headers': {},
      'http': { adapter: {}},
      'http_security': {},
      'instance': { poll_limits: {}},
      'level': {},
      'ldap': {},
      'markup': {},
      'max_age': {},
      'media_proxy': { proxy_opts: {}},
      'meta': {},
      'methods': {},
      'mrf_hellthread': {},
      'mrf_keyword': { replace: {}},
      'mrf_mention': {},
      'mrf_normalize_markup': {},
      'mrf_rejectnonpublic': {},
      'mrf_simple': {},
      'mrf_subchain': { match_actor: {}},
      'mrf_user_allowlist': {},
      'oauth2': {},
      'password_authenticator': {},
      'Pleroma.Captcha': {},
      'Pleroma.Captcha.Kocaptcha': {},
      'Pleroma.Emails.Mailer': {},
      'Pleroma.Repo': {},
      'Pleroma.ScheduledActivity': {},
      'Pleroma.Upload': { proxy_opts: {}},
      'Pleroma.Upload.Filter.AnonymizeFilename': {},
      'Pleroma.Upload.Filter.Mogrify': {},
      'Pleroma.Uploaders.Local': {},
      'Pleroma.Uploaders.MDII': {},
      'Pleroma.Uploaders.S3': {},
      'Pleroma.User': {},
      'Pleroma.Web.Auth.Authenticator': {},
      'Pleroma.Web.Endpoint':
        { http: false, url: {}, render_errors: {}, pubsub: {}},
      'Pleroma.Web.Federator.RetryQueue': {},
      'Pleroma.Web.Metadata': {},
      'port': {},
      'priv_dir': {},
      'queues': {},
      'rate_limit': {},
      'rich_media': {},
      'suggestions': {},
      'types': { value: {}},
      'Ueberauth': {},
      'Ueberauth.Strategy.Facebook.OAuth': {},
      'Ueberauth.Strategy.Google.OAuth': {},
      'Ueberauth.Strategy.Microsoft.OAuth': {},
      'Ueberauth.Strategy.Twitter.OAuth': {},
      'user': {},
      'uri_schemes': {},
      'vapid_details': {},
      'webhook_url': {}
    },
    ignoredIfNotEnabled: ['enabled', 'handler', 'password_authenticator', 'port', 'priv_dir'],
    loading: true
  },
  mutations: {
    REWRITE_CONFIG: (state, { tab, data }) => {
      state.settings[tab] = data
    },
    SET_LOADING: (state, status) => {
      state.loading = status
    },
    SET_SETTINGS: (state, data) => {
      const newSettings = data.reduce((acc, config) => {
        const key = config.key[0] === ':' ? config.key.substr(1) : config.key
        const value = valueHasTuples(key, config.value) ? { value: config.value } : parseTuples(config.value, key)
        acc[key] = { ...acc[key], ...value }
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
      if (response.data.configs.length === 0) {
        dispatch('SubmitChanges', initialSettings)
      } else {
        commit('SET_SETTINGS', response.data.configs)
      }
      commit('SET_LOADING', false)
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
      const updatedValue = { ...state.settings[tab][inputName], ...{ [childName]: response.data.url }}
      dispatch('UpdateSettings', { tab, data: { [inputName]: updatedValue }})
    }
  }
}

export default settings
