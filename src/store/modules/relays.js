import { fetchRelays, addRelay, deleteRelay } from '@/api/relays'

const relays = {
  state: {
    fetchedRelays: [],
    loading: true
  },
  mutations: {
    SET_LOADING: (state, loading) => {
      state.loading = loading
    },
    SET_RELAYS: (state, relays) => {
      state.fetchedRelays = relays
    },
    ADD_RELAY: (state, relay) => {
      state.fetchedRelays = [...state.fetchedRelays, relay]
    },
    DELETE_RELAY: (state, relay) => {
      state.fetchedRelays = state.fetchedRelays.filter(fetchedRelay => fetchedRelay !== relay)
    }
  },
  actions: {
    async FetchRelays({ commit, getters }) {
      commit('SET_LOADING', true)

      const response = await fetchRelays(getters.authHost, getters.token)

      commit('SET_RELAYS', response.data.relays)
      commit('SET_LOADING', false)
    },
    async AddRelay({ commit, getters }, relay) {
      commit('ADD_RELAY', relay)

      await addRelay(relay, getters.authHost, getters.token)
    },
    async DeleteRelay({ commit, getters }, relay) {
      commit('DELETE_RELAY', relay)

      await deleteRelay(relay, getters.authHost, getters.token)
    }
  }
}

export default relays
