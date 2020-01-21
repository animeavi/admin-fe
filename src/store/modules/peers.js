import { fetchPeers } from '@/api/peers'

const peers = {
  state: {
    fetchedPeers: [],
    loading: true
  },

  mutations: {
    SET_PEERS: (state, peers) => {
      state.fetchedPeers = peers
    },
    SET_LOADING: (state, status) => {
      state.loading = status
    }
  },

  actions: {
    async FetchPeers({ commit, getters }) {
      const peers = await fetchPeers(getters.authHost, getters.token)

      commit('SET_PEERS', [...peers.data].sort())
      commit('SET_LOADING', false)
    }
  }
}

export default peers
