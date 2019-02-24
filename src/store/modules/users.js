import { fetchUsers } from '@/api/users'

const user = {
  state: {
    fetchedUsers: [],
    loading: true
  },
  mutations: {
    SET_USERS: (state, users) => {
      state.fetchedUsers = users
    },
    SET_LOADING: (state, status) => {
      state.loading = status
    }
  },
  actions: {
    async FetchUsers({ commit }) {
      const response = await fetchUsers()

      commit('SET_USERS', response.data)
      commit('SET_LOADING', false)
    }
  }
}

export default user
