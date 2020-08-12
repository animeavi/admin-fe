import { listBannedUrls, purgeUrls, removeBannedUrls } from '@/api/mediaProxyCache'
import { Message } from 'element-ui'
import i18n from '@/lang'

const mediaProxyCache = {
  state: {
    bannedUrls: [],
    currentPage: 1,
    loading: false,
    pageSize: 50,
    totalUrlsCount: 0
  },
  mutations: {
    SET_BANNED_URLS: (state, urls) => {
      state.bannedUrls = urls.map(el => { return { url: el } })
    },
    SET_TOTAL_URLS_COUNT: (state, count) => {
      state.totalUrlsCount = count
    },
    SET_LOADING: (state, status) => {
      state.loading = status
    },
    SET_PAGE: (state, page) => {
      state.currentPage = page
    }
  },
  actions: {
    async ListBannedUrls({ commit, getters, state }, { page }) {
      commit('SET_LOADING', true)
      const response = await listBannedUrls(page, state.pageSize, getters.authHost, getters.token)
      commit('SET_BANNED_URLS', response.data.urls)
      commit('SET_TOTAL_URLS_COUNT', response.data.count)
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
        dispatch('ListBannedUrls', { page: state.currentPage })
      }
    },
    async RemoveBannedUrls({ dispatch, getters, state }, urls) {
      await removeBannedUrls(urls, getters.authHost, getters.token)
      dispatch('ListBannedUrls', { page: state.currentPage })
    }
  }
}

export default mediaProxyCache
