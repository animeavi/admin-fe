import { listBannedUrls, purgeUrls, removeBannedUrls } from '@/api/mediaProxyCache'
import { Message } from 'element-ui'
import i18n from '@/lang'

const mediaProxyCache = {
  state: {
    bannedUrls: [],
    bannedUrlsCount: 0,
    currentPage: 1,
    loading: false
  },
  mutations: {
    SET_BANNED_URLS: (state, urls) => {
      state.bannedUrls = urls.map(el => { return { url: el } })
    },
    SET_BANNED_URLS_COUNT: (state, count) => {
      state.bannedUrlsCount = count
    },
    SET_LOADING: (state, status) => {
      state.loading = status
    },
    SET_PAGE: (state, page) => {
      state.currentPage = page
    }
  },
  actions: {
    async ListBannedUrls({ commit, getters }, page) {
      commit('SET_LOADING', true)
      const response = await listBannedUrls(page, getters.authHost, getters.token)
      commit('SET_BANNED_URLS', response.data.urls)
      // commit('SET_BANNED_URLS_COUNT', count)
      commit('SET_PAGE', page)
      commit('SET_LOADING', false)
    },
    async PurgeUrls({ dispatch, getters, state }, { urls, ban }) {
      await purgeUrls(urls, ban, getters.authHost, getters.token)
      Message({
        message: i18n.t('mediaProxyCache.evictedMessage'),
        type: 'success',
        duration: 5 * 1000
      })
      if (ban) {
        dispatch('ListBannedUrls', state.currentPage)
      }
    },
    async RemoveBannedUrls({ dispatch, getters, state }, urls) {
      await removeBannedUrls(urls, getters.authHost, getters.token)
      dispatch('ListBannedUrls', state.currentPage)
    }
  }
}

export default mediaProxyCache
