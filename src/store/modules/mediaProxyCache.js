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
      state.bannedUrls = urls
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
    async PurgeUrls({ commit, getters }, { urls, ban }) {
      await purgeUrls(urls, ban, getters.authHost, getters.token)
      Message({
        message: i18n.t('mediaProxyCache.evictedMessage'),
        type: 'success',
        duration: 5 * 1000
      })
    },
    async RemoveBannedUrls({ commit, getters }, urls) {
      await removeBannedUrls(urls, getters.authHost, getters.token)
    }
  }
}

export default mediaProxyCache
