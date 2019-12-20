import { fetchPeers, fetchInstanceInfo } from '@/api/instance'

const instance = {
  state: {
    fetchedPeers: [],
    peersLoading: true,
    fetchedStatusCounts: {},
    statusCountsLoading: true
  },
  mutations: {
    SET_PEERS: (state, peers) => {
      state.fetchedPeers = peers
    },
    SET_PEERS_LOADING: (state, status) => {
      state.peersLoading = status
    },
    SET_STATUS_COUNTS: (state, counts) => {
      state.fetchedStatusCounts = counts
    },
    SET_STATUS_COUNTS_LOADING: (state, status) => {
      state.statusCountsLoading = status
    }
  },
  actions: {
    async FetchPeers({ commit, getters }) {
      const peers = await fetchPeers(getters.authHost, getters.token)

      commit('SET_PEERS', peers.data)
      commit('SET_PEERS_LOADING', false)
    },
    async FetchStatusCounts({ commit, getters }) {
      const info = await fetchInstanceInfo(getters.authHost, getters.token)

      commit('SET_STATUS_COUNTS', info.data.stats.status_count)
      commit('SET_STATUS_COUNTS_LOADING', false)
    }
  }
}

export default instance
