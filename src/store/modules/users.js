import { fetchUsers, toggleUserActivation } from '@/api/users'

const user = {
  state: {
    fetchedUsers: [],
    loading: true
  },
  mutations: {
    SET_USERS: (state, users) => {
      state.fetchedUsers = users.sort((a, b) => a.id.localeCompare(b.id))
    },
    SET_LOADING: (state, status) => {
      state.loading = status
    },
    SWAP_USER: (state, user) => {
      const usersWithoutSwapped = state.fetchedUsers.filter((u) => {
        return u.id !== user.id
      })

      state.fetchedUsers = [...usersWithoutSwapped, user].sort((a, b) => a.id.localeCompare(b.id))
    }
  },
  actions: {
    async FetchUsers({ commit }) {
      const response = await fetchUsers()

      commit('SET_USERS', response.data)
      commit('SET_LOADING', false)
    },
    async ToggleUserActivation({ commit }, nickname) {
      const response = await toggleUserActivation(nickname)

      commit('SWAP_USER', response.data)
    }
  }
}

export default user
