import { fetchUser, fetchUserStatuses } from '@/api/users'

const userProfile = {
  state: {
    user: {},
    loading: true,
    statuses: []
  },
  mutations: {
    SET_USER: (state, user) => {
      state.user = user
    },
    SET_LOADING: (state, status) => {
      state.loading = status
    },
    SET_STATUSES: (state, statuses) => {
      state.statuses = statuses
    }
  },
  actions: {
    async FetchData({ commit, getters }, { id, godmode }) {
      commit('SET_LOADING', true)

      const [userResponse, statusesResponse] = await Promise.all([
        fetchUser(id, getters.authHost, getters.token),
        fetchUserStatuses(id, getters.authHost, godmode, getters.token)
      ])

      commit('SET_USER', userResponse.data)
      commit('SET_STATUSES', statusesResponse.data)
      commit('SET_LOADING', false)
    }
  }
}

export default userProfile
